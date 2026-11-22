import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AppState } from 'react-native';
import { AppAlert } from '../../components/AppAlert';
import * as Location from 'expo-location';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import { startRun, addRunPoints, finishRun, getRun } from '../../api/running';
import { getErrorMessage, shouldRetry } from '../../api/errors';
import type { Coordinate, RunPointInput, RunSession } from '../../api/types';
import { totalDistance } from '../../utils/geo';
import { formatDateTime } from '../../utils/format';
import { LIMITS } from '../forms/limits';
import { alertPermissionDenied } from '../permissions/alertPermissionDenied';
import { clearActiveRun, readActiveRun, saveActiveRun, type ActiveRun } from '../../offline/activeRun';

export type TrackerStatus = 'idle' | 'starting' | 'running' | 'finishing';

const FLUSH_EVERY_SECONDS = 15;
/** Cada cuántos segundos se guarda la corrida en el teléfono mientras está activa. */
const SAVE_EVERY_SECONDS = 5;
const KEEP_AWAKE_TAG = 'run-tracker';
/** Lecturas con un margen de error mayor a esto (en metros) se descartan. */
const MAX_ACCURACY_METERS = 30;
const LOCATION_PERMISSION_MESSAGE = 'Necesitamos permiso de ubicación para registrar tu recorrido.';

function toInput(position: Location.LocationObject): RunPointInput {
    return {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        timestamp: new Date(position.timestamp).toISOString(),
    };
}

function toCoordinate(point: Coordinate): Coordinate {
    return { latitude: point.latitude, longitude: point.longitude };
}

/**
 * Envía los puntos en partes de máximo LIMITS.runPointsPerRequest (el límite de la API).
 * Si una parte falla, regresa los puntos que no se enviaron para reintentarlos después,
 * sin repetir las partes que ya se guardaron.
 */
async function sendPoints(sessionId: string, points: RunPointInput[]) {
    for (let start = 0; start < points.length; start += LIMITS.runPointsPerRequest) {
        try {
            await addRunPoints(sessionId, points.slice(start, start + LIMITS.runPointsPerRequest));
        } catch (error) {
            return { unsent: points.slice(start), error };
        }
    }
    return { unsent: [], error: null };
}

export function useRunTracker() {
    const [status, setStatus] = useState<TrackerStatus>('idle');
    const [route, setRoute] = useState<Coordinate[]>([]);
    const [elapsedSeconds, setElapsedSeconds] = useState(0);
    const [result, setResult] = useState<RunSession | null>(null);

    const sessionIdRef = useRef<string | null>(null);
    const startedAtRef = useRef(0);
    const tickRef = useRef(0);
    const pendingRef = useRef<RunPointInput[]>([]);
    const lastPointAtRef = useRef<string | null>(null);
    const subscriptionRef = useRef<Location.LocationSubscription | null>(null);
    // Candado contra doble toque: mientras una acción (iniciar, terminar, retomar)
    // está en curso, las demás se ignoran. El estado de React tarda un render en
    // desactivar el botón; la ref se actualiza al instante.
    const busyRef = useRef(false);

    const distanceMeters = useMemo(() => totalDistance(route), [route]);

    /** Guarda la corrida activa en el teléfono para recuperarla si la app se cierra. */
    const persist = useCallback(() => {
        const sessionId = sessionIdRef.current;
        if (!sessionId) {
            return;
        }
        saveActiveRun({
            sessionId,
            startedAt: startedAtRef.current,
            pending: pendingRef.current,
            lastPointAt: lastPointAtRef.current,
        });
    }, []);

    function record(position: Location.LocationObject) {
        const { accuracy } = position.coords;
        if (accuracy != null && accuracy > MAX_ACCURACY_METERS) {
            return;
        }

        const point = toInput(position);
        setRoute((prev) => [...prev, toCoordinate(point)]);
        pendingRef.current.push(point);
        lastPointAtRef.current = point.timestamp;
    }

    async function startWatching() {
        subscriptionRef.current = await Location.watchPositionAsync(
            {
                accuracy: Location.Accuracy.BestForNavigation,
                distanceInterval: 5,
                timeInterval: 2000,
            },
            record,
        );
        // Si la pantalla se bloquea, iOS/Android dejan de mandar ubicaciones a la app
        // y la ruta queda con huecos dibujados como líneas rectas.
        activateKeepAwakeAsync(KEEP_AWAKE_TAG).catch(() => undefined);
    }

    function stopWatching() {
        subscriptionRef.current?.remove();
        subscriptionRef.current = null;
        deactivateKeepAwake(KEEP_AWAKE_TAG);
    }

    /** Pide el permiso de ubicación; si se niega, avisa (con acceso a Ajustes si hace falta). */
    async function ensureLocationPermission() {
        const permission = await Location.requestForegroundPermissionsAsync();
        if (permission.status !== 'granted') {
            alertPermissionDenied(LOCATION_PERMISSION_MESSAGE, permission.canAskAgain);
            return false;
        }
        return true;
    }

    function clearSession() {
        sessionIdRef.current = null;
        pendingRef.current = [];
        lastPointAtRef.current = null;
    }

    const flush = useCallback(async () => {
        const sessionId = sessionIdRef.current;
        if (!sessionId || pendingRef.current.length === 0) {
            return;
        }

        const batch = pendingRef.current;
        pendingRef.current = [];

        const { unsent } = await sendPoints(sessionId, batch);
        if (unsent.length > 0) {
            pendingRef.current = [...unsent, ...pendingRef.current];
        }
        persist();
    }, [persist]);

    useEffect(() => {
        if (status !== 'running') {
            return undefined;
        }

        const id = setInterval(() => {
            setElapsedSeconds(Math.floor((Date.now() - startedAtRef.current) / 1000));
            tickRef.current += 1;

            if (tickRef.current % FLUSH_EVERY_SECONDS === 0) {
                flush();
            } else if (tickRef.current % SAVE_EVERY_SECONDS === 0) {
                persist();
            }
        }, 1000);

        return () => clearInterval(id);
    }, [status, flush, persist]);

    // Al salir de la app se guarda de inmediato: el sistema puede cerrarla sin avisar.
    useEffect(() => {
        const subscription = AppState.addEventListener('change', (state) => {
            if (state !== 'active') {
                persist();
            }
        });
        return () => subscription.remove();
    }, [persist]);

    useEffect(() => {
        return () => {
            subscriptionRef.current?.remove();
            deactivateKeepAwake(KEEP_AWAKE_TAG);
        };
    }, []);

    async function start() {
        if (busyRef.current || sessionIdRef.current) {
            return;
        }
        busyRef.current = true;

        try {
            if (!(await ensureLocationPermission())) {
                return;
            }

            setStatus('starting');
            const first = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.BestForNavigation,
            });
            const session = await startRun();

            sessionIdRef.current = session.id;
            startedAtRef.current = Date.now();
            tickRef.current = 0;
            pendingRef.current = [];
            lastPointAtRef.current = null;
            setRoute([]);
            setElapsedSeconds(0);
            setResult(null);
            record(first);
            persist();

            await startWatching();
            setStatus('running');
        } catch (error) {
            AppAlert.alert(getErrorMessage(error, 'No se pudo iniciar la corrida.'));
            setStatus('idle');
        } finally {
            busyRef.current = false;
        }
    }

    async function finish() {
        const sessionId = sessionIdRef.current;
        if (busyRef.current || !sessionId) {
            return;
        }
        busyRef.current = true;

        try {
            setStatus('finishing');
            const batch = pendingRef.current;
            pendingRef.current = [];

            const { unsent, error: sendError } = await sendPoints(sessionId, batch);
            if (sendError) {
                pendingRef.current = [...unsent, ...pendingRef.current];
                persist();
                setStatus('running');
                AppAlert.alert(getErrorMessage(sendError, 'No se pudo terminar la corrida.'));
                return;
            }

            try {
                const session = await finishRun(sessionId);
                stopWatching();
                clearSession();
                await clearActiveRun();
                setResult(session);
                setStatus('idle');
            } catch (error) {
                persist();
                setStatus('running');
                AppAlert.alert(getErrorMessage(error, 'No se pudo terminar la corrida.'));
            }
        } finally {
            busyRef.current = false;
        }
    }

    /** Retoma una corrida guardada: sigue registrando desde donde se quedó. */
    async function resumeRun(saved: ActiveRun) {
        if (busyRef.current) {
            return;
        }
        busyRef.current = true;

        try {
            if (!(await ensureLocationPermission())) {
                // Sin permiso no se puede seguir; la corrida queda guardada para decidir después.
                return;
            }

            setStatus('starting');
            sessionIdRef.current = saved.sessionId;
            startedAtRef.current = saved.startedAt;
            pendingRef.current = [...saved.pending];
            lastPointAtRef.current = saved.lastPointAt;
            tickRef.current = 0;
            setResult(null);

            // La ruta en pantalla = lo que ya llegó al servidor + lo pendiente en el teléfono.
            let sent: Coordinate[] = [];
            try {
                const session = await getRun(saved.sessionId);
                sent = (session.points ?? []).map(toCoordinate);
            } catch {
                // Sin conexión: se muestra solo lo pendiente; los puntos siguen guardados.
            }
            setRoute([...sent, ...saved.pending.map(toCoordinate)]);
            setElapsedSeconds(Math.floor((Date.now() - saved.startedAt) / 1000));

            await startWatching();
            setStatus('running');
        } catch (error) {
            clearSession();
            setStatus('idle');
            AppAlert.alert(getErrorMessage(error, 'No se pudo retomar la corrida.'));
        } finally {
            busyRef.current = false;
        }
    }

    /**
     * Termina una corrida guardada con lo que se registró. La hora de término es la del
     * último punto, para que la duración no incluya el tiempo que la app estuvo cerrada.
     */
    async function finishSavedRun(saved: ActiveRun) {
        if (busyRef.current) {
            return;
        }
        busyRef.current = true;

        try {
            setStatus('finishing');
            const { unsent, error: sendError } = await sendPoints(saved.sessionId, saved.pending);
            if (sendError && !shouldRetry(sendError)) {
                // El servidor rechazó los puntos (p. ej. la corrida ya estaba terminada).
                await clearActiveRun();
                AppAlert.alert(getErrorMessage(sendError, 'No se pudo guardar la corrida.'));
                return;
            }
            if (sendError) {
                await saveActiveRun({ ...saved, pending: unsent });
                AppAlert.alert(
                    getErrorMessage(sendError, 'No se pudo terminar la corrida.'),
                    'La corrida sigue guardada; podrás terminarla la próxima vez que abras esta pantalla.',
                );
                return;
            }

            try {
                const session = await finishRun(saved.sessionId, saved.lastPointAt ?? undefined);
                await clearActiveRun();
                setRoute((session.points ?? []).map(toCoordinate));
                setResult(session);
            } catch (error) {
                if (shouldRetry(error)) {
                    // Sin conexión o error del servidor: se conserva para intentarlo después.
                    await saveActiveRun({ ...saved, pending: [] });
                    AppAlert.alert(
                        getErrorMessage(error, 'No se pudo terminar la corrida.'),
                        'La corrida sigue guardada; podrás terminarla la próxima vez que abras esta pantalla.',
                    );
                } else {
                    // El servidor la rechazó (p. ej. muy pocos puntos o ya estaba terminada):
                    // no tiene caso seguir guardándola.
                    await clearActiveRun();
                    AppAlert.alert(getErrorMessage(error, 'No se pudo guardar la corrida.'));
                }
            }
        } finally {
            setStatus('idle');
            busyRef.current = false;
        }
    }

    // Al abrir la pantalla, si quedó una corrida sin terminar, se ofrece continuarla o terminarla.
    useEffect(() => {
        let cancelled = false;

        readActiveRun().then((saved) => {
            if (cancelled || !saved || sessionIdRef.current) {
                return;
            }
            const lastTime = saved.lastPointAt ? formatDateTime(saved.lastPointAt) : null;
            AppAlert.alert(
                'Tienes una corrida sin terminar',
                lastTime
                    ? `Se interrumpió porque la app se cerró. Lo último que se registró fue el ${lastTime}. Puedes continuarla o terminarla con lo registrado.`
                    : 'Se interrumpió porque la app se cerró. Puedes continuarla o terminarla con lo registrado.',
                [
                    { text: 'Terminar', onPress: () => finishSavedRun(saved) },
                    { text: 'Continuar', onPress: () => resumeRun(saved) },
                ],
            );
        });

        return () => {
            cancelled = true;
        };
        // Solo al montar la pantalla.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function reset() {
        setResult(null);
        setRoute([]);
        setElapsedSeconds(0);
    }

    return {
        status,
        route,
        distanceMeters,
        elapsedSeconds,
        result,
        start,
        finish,
        reset,
    };
}

export type RunTracker = ReturnType<typeof useRunTracker>;
