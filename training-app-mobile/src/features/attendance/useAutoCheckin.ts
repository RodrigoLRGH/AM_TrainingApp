import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';
import { AppAlert } from '../../components/AppAlert';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import { isAxiosError } from 'axios';
import { checkinGeo } from '../../api/attendance';

const ASKED_KEY = 'autoCheckin.asked';
const MIN_GAP_MS = 30 * 1000;
const RECHECK_EVERY_MS = 5 * 60 * 1000;

function askWithExplanation(): Promise<boolean> {
    return new Promise((resolve) => {
        AppAlert.alert(
            'Registro automático de asistencia',
            'Usamos tu ubicación, solo mientras usas la app, para registrar tu asistencia cuando llegues al gimnasio.',
            [
                { text: 'Ahora no', style: 'cancel', onPress: () => resolve(false) },
                {
                    text: 'Continuar',
                    onPress: async () => {
                        const result = await Location.requestForegroundPermissionsAsync();
                        resolve(result.granted);
                    },
                },
            ],
            { onDismiss: () => resolve(false) },
        );
    });
}

async function ensurePermission(): Promise<boolean> {
    const current = await Location.getForegroundPermissionsAsync();
    if (current.granted) {
        return true;
    }

    if (!current.canAskAgain) {
        return false;
    }

    const alreadyAsked = await AsyncStorage.getItem(ASKED_KEY);
    if (alreadyAsked) {
        return false;
    }

    await AsyncStorage.setItem(ASKED_KEY, '1');
    return askWithExplanation();
}

export function useAutoCheckin(enabled: boolean) {
    const [message, setMessage] = useState<string | null>(null);
    const doneDayRef = useRef<string | null>(null);
    const lastAttemptRef = useRef(0);
    const runningRef = useRef(false);

    const attempt = useCallback(async () => {
        const today = new Date().toDateString();

        if (runningRef.current || doneDayRef.current === today) {
            return;
        }

        if (Date.now() - lastAttemptRef.current < MIN_GAP_MS) {
            return;
        }

        runningRef.current = true;
        lastAttemptRef.current = Date.now();

        try {
            const permitted = await ensurePermission();
            if (!permitted) {
                return;
            }

            const position = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.High,
            });

            await checkinGeo({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
            });

            doneDayRef.current = today;
            setMessage('Asistencia registrada automáticamente');
        } catch (error) {
            if (isAxiosError(error) && error.response?.status === 409) {
                doneDayRef.current = today;
            }
        } finally {
            runningRef.current = false;
        }
    }, []);

    useEffect(() => {
        if (!enabled) {
            doneDayRef.current = null;
            lastAttemptRef.current = 0;
            return undefined;
        }

        attempt();

        const intervalId = setInterval(attempt, RECHECK_EVERY_MS);
        const subscription = AppState.addEventListener('change', (status) => {
            if (status === 'active') {
                attempt();
            }
        });

        return () => {
            clearInterval(intervalId);
            subscription.remove();
        };
    }, [enabled, attempt]);

    function dismiss() {
        setMessage(null);
    }

    return { message, dismiss };
}