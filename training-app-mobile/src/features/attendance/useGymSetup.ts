import { useCallback, useState } from 'react';
import { AppAlert } from '../../components/AppAlert';
import { useFocusEffect } from 'expo-router';
import * as Location from 'expo-location';
import { getGymConfig, setGymLocation, generateGymQr } from '../../api/attendance';
import type { GymConfig } from '../../api/types';
import { useForm } from '../forms/useForm';
import { integerAtLeast } from '../forms/rules';


export function useGymSetup() {
    const [config, setConfig] = useState<GymConfig | null>(null);
    const [loading, setLoading] = useState(true);
    const radiusForm = useForm(
        { radius: '100' },
        { radius: integerAtLeast(10, 'El radio debe ser un número entero de al menos 10 metros.') },
    );
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
        if (!radiusForm.validate()) {
            return;
        }
        const radiusMeters = Number(radiusForm.values.radius.trim());

        setSaving(true);
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                AppAlert.alert('Necesitamos permiso de ubicación para guardar la ubicación del gimnasio.');
                return;
            }

            const position = await Location.getCurrentPositionAsync({});
            await setGymLocation({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                radiusMeters,
            });
            await refresh();
            AppAlert.alert('Ubicación del gimnasio guardada');
        } catch (error) {
            AppAlert.alert('No se pudo guardar la ubicación.');
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
            AppAlert.alert('No se pudo generar el código QR.');
        } finally {
            setSaving(false);
        }
    }

    return {
        config,
        loading,
        radius: radiusForm.values.radius,
        setRadius: (value: string) => radiusForm.setValue('radius', value),
        onRadiusBlur: () => radiusForm.handleBlur('radius'),
        radiusError: radiusForm.errorFor('radius'),
        saving,
        saveCurrentLocation,
        generateQr,
    };
}