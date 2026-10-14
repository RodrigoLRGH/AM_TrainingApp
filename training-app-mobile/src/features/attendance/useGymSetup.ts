import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import { useFocusEffect } from 'expo-router';
import * as Location from 'expo-location';
import { getGymConfig, setGymLocation, generateGymQr } from '../../api/attendance';

export type GymConfig = {
    gymLatitude: number | null;
    gymLongitude: number | null;
    gymRadiusMeters: number | null;
    gymQrCode: string | null;
};

export function useGymSetup() {
    const [config, setConfig] = useState<GymConfig | null>(null);
    const [loading, setLoading] = useState(true);
    const [radius, setRadius] = useState('100');
    const [saving, setSaving] = useState(false);

    const refresh = useCallback(async () => {
        const data = await getGymConfig();
        setConfig(data);
    }, []);

    const load = useCallback(async () => {
        setLoading(true);
        try {
            await refresh();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [refresh]);

    useFocusEffect(
        useCallback(() => {
            load();
        }, [load]),
    );

    async function saveCurrentLocation() {
        const radiusMeters = Number(radius);
        if (!Number.isInteger(radiusMeters) || radiusMeters < 10) {
            Alert.alert('El radio debe ser un número entero de al menos 10 metros.');
            return;
        }

        setSaving(true);
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Necesitamos permiso de ubicación para guardar la ubicación del gimnasio.');
                return;
            }

            const position = await Location.getCurrentPositionAsync({});
            await setGymLocation({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                radiusMeters,
            });
            await refresh();
            Alert.alert('Ubicación del gimnasio guardada');
        } catch (error) {
            Alert.alert('No se pudo guardar la ubicación.');
        } finally {
            setSaving(false);
        }
    }

    async function generateQr() {
        setSaving(true);
        try {
            await generateGymQr();
            await refresh();
        } catch (error) {
            Alert.alert('No se pudo generar el código QR.');
        } finally {
            setSaving(false);
        }
    }

    return {
        config,
        loading,
        radius,
        setRadius,
        saving,
        saveCurrentLocation,
        generateQr,
    };
}