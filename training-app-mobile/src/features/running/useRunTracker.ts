import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alert } from 'react-native';
import * as Location from 'expo-location';
import { startRun, addRunPoints, finishRun } from '../../api/running';
import { getErrorMessage } from '../../api/errors';
import type { Coordinate, RunPointInput, RunSession } from '../../api/types';
import { totalDistance } from '../../utils/geo';

export type TrackerStatus = 'idle' | 'starting' | 'running' | 'finishing';

const FLUSH_EVERY_SECONDS = 15;

function toInput(position: Location.LocationObject): RunPointInput {
    return {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        timestamp: new Date(position.timestamp).toISOString(),
    };
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
        const point = toInput(position);
        setRoute((prev) => [...prev, { latitude: point.latitude, longitude: point.longitude }]);
        pendingRef.current.push(point);
    }

    function stopWatching() {
        subscriptionRef.current?.remove();
        subscriptionRef.current = null;
    }

    const flush = useCallback(async () => {
        const sessionId = sessionIdRef.current;
        if (!sessionId || pendingRef.current.length === 0) {
            return;
        }

        const batch = pendingRef.current;
        pendingRef.current = [];

        try {
            await addRunPoints(sessionId, batch);
        } catch (error) {
            pendingRef.current = [...batch, ...pendingRef.current];
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
        };
    }, []);

    async function start() {
        const permission = await Location.requestForegroundPermissionsAsync();
        if (permission.status !== 'granted') {
            Alert.alert('Necesitamos permiso de ubicación para registrar tu recorrido.');
            return;
        }

        setStatus('starting');
        try {
            const first = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.High,
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
                    accuracy: Location.Accuracy.High,
                    distanceInterval: 5,
                    timeInterval: 3000,
                },
                record,
            );
            setStatus('running');
        } catch (error) {
            Alert.alert(getErrorMessage(error, 'No se pudo iniciar la corrida.'));
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
        let sent = false;

        try {
            if (batch.length > 0) {
                await addRunPoints(sessionId, batch);
                sent = true;
            }

            const session = await finishRun(sessionId);
            stopWatching();
            sessionIdRef.current = null;
            setResult(session);
            setStatus('idle');
        } catch (error) {
            if (!sent) {
                pendingRef.current = [...batch, ...pendingRef.current];
            }
            setStatus('running');
            Alert.alert(getErrorMessage(error, 'No se pudo terminar la corrida.'));
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