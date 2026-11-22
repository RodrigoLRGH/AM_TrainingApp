import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AppAlert } from '../../components/AppAlert';
import * as Location from 'expo-location';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import { startRun, addRunPoints, finishRun } from '../../api/running';
import { getErrorMessage } from '../../api/errors';
import type { Coordinate, RunPointInput, RunSession } from '../../api/types';
import { totalDistance } from '../../utils/geo';
import { LIMITS } from '../forms/limits';

export type TrackerStatus = 'idle' | 'starting' | 'running' | 'finishing';

const FLUSH_EVERY_SECONDS = 15;
const KEEP_AWAKE_TAG = 'run-tracker';
/** Lecturas con un margen de error mayor a esto (en metros) se descartan. */
const MAX_ACCURACY_METERS = 30;

function toInput(position: Location.LocationObject): RunPointInput {
    return {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        timestamp: new Date(position.timestamp).toISOString(),
    };
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
    const subscriptionRef = useRef<Location.LocationSubscription | null>(null);

    const distanceMeters = useMemo(() => totalDistance(route), [route]);

    function record(position: Location.LocationObject) {
        const { accuracy } = position.coords;
        if (accuracy != null && accuracy > MAX_ACCURACY_METERS) {
            return;
        }

        const point = toInput(position);
        setRoute((prev) => [...prev, { latitude: point.latitude, longitude: point.longitude }]);
        pendingRef.current.push(point);
    }

    function stopWatching() {
        subscriptionRef.current?.remove();
        subscriptionRef.current = null;
        deactivateKeepAwake(KEEP_AWAKE_TAG);
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
    }, []);

    useEffect(() => {
        if (status !== 'running') {
            return undefined;
        }

        const id = setInterval(() => {
            setElapsedSeconds(Math.floor((Date.now() - startedAtRef.current) / 1000));
            tickRef.current += 1;

            if (tickRef.current % FLUSH_EVERY_SECONDS === 0) {
                flush();
            }
        }, 1000);

        return () => clearInterval(id);
    }, [status, flush]);

    useEffect(() => {
        return () => {
            subscriptionRef.current?.remove();
            deactivateKeepAwake(KEEP_AWAKE_TAG);
        };
    }, []);

    async function start() {
        const permission = await Location.requestForegroundPermissionsAsync();
        if (permission.status !== 'granted') {
            AppAlert.alert('Necesitamos permiso de ubicación para registrar tu recorrido.');
            return;
        }

        setStatus('starting');
        try {
            const first = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.BestForNavigation,
            });
            const session = await startRun();

            sessionIdRef.current = session.id;
            startedAtRef.current = Date.now();
            tickRef.current = 0;
            pendingRef.current = [];
            setRoute([]);
            setElapsedSeconds(0);
            setResult(null);
            record(first);

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
            setStatus('running');
        } catch (error) {
            AppAlert.alert(getErrorMessage(error, 'No se pudo iniciar la corrida.'));
            setStatus('idle');
        }
    }

    async function finish() {
        const sessionId = sessionIdRef.current;
        if (!sessionId) {
            return;
        }

        setStatus('finishing');
        const batch = pendingRef.current;
        pendingRef.current = [];

        const { unsent, error: sendError } = await sendPoints(sessionId, batch);
        if (sendError) {
            pendingRef.current = [...unsent, ...pendingRef.current];
            setStatus('running');
            AppAlert.alert(getErrorMessage(sendError, 'No se pudo terminar la corrida.'));
            return;
        }

        try {
            const session = await finishRun(sessionId);
            stopWatching();
            sessionIdRef.current = null;
            setResult(session);
            setStatus('idle');
        } catch (error) {
            setStatus('running');
            AppAlert.alert(getErrorMessage(error, 'No se pudo terminar la corrida.'));
        }
    }

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