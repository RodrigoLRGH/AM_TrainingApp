import { useCallback, useState } from 'react';
import { AppAlert } from '../../components/AppAlert';
import { useFocusEffect } from 'expo-router';
import * as Location from 'expo-location';
import { getGymConfig, setGymLocation, generateGymQr } from '../../api/attendance';
import type { GymConfig } from '../../api/types';
import { useForm } from '../forms/useForm';
import { integerBetween } from '../forms/rules';
import { LIMITS } from '../forms/limits';
import { loadErrorMessage } from '../../api/errors';


export function useGymSetup() {
    const [config, setConfig] = useState<GymConfig | null>(null);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);
    const radiusForm = useForm(
        { radius: '100' },
        {
            radius: integerBetween(
                10,
                LIMITS.gymRadiusMeters,
                `El radio debe ser un número entero entre 10 y ${LIMITS.gymRadiusMeters} metros.`,
            ),
        },
    );
    const [saving, setSaving] = useState(false);

    const refresh = useCallback(async () => {
        const data = await getGymConfig();
        setConfig(data);
    }, []);

    const load = useCallback(async () => {
        setLoading(true);
        setLoadError(null);
        try {
            await refresh();
        } catch (error) {
            setLoadError(loadErrorMessage(error, 'No se pudo cargar la configuración del gimnasio.'));
        } finally {
            setLoading(false);
        }
    }, [refresh]);

    useFocusEffect(
        useCallback(() => {
            load();
        }, [load]),
    );

    function saveCurrentLocation() {
        if (!radiusForm.validate()) {
            return;
        }
        const radiusMeters = Number(radiusForm.values.radius.trim());
        const configured = config?.gymLatitude != null && config?.gymLongitude != null;

        AppAlert.alert(
            configured ? 'Cambiar ubicación del gimnasio' : 'Guardar ubicación del gimnasio',
            configured
                ? `Se reemplazará la ubicación actual por tu ubicación actual, con un radio de ${radiusMeters} m. La asistencia de tus clientes se validará con la nueva ubicación. ¿Quieres continuar?`
                : `Se guardará tu ubicación actual como la del gimnasio, con un radio de ${radiusMeters} m. ¿Quieres continuar?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: configured ? 'Cambiar ubicación' : 'Guardar',
                    onPress: () => applyCurrentLocation(radiusMeters),
                },
            ],
        );
    }

    async function applyCurrentLocation(radiusMeters: number) {
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
        loadError,
        reload: load,
        radius: radiusForm.values.radius,
        setRadius: (value: string) => radiusForm.setValue('radius', value),
        onRadiusBlur: () => radiusForm.handleBlur('radius'),
        radiusError: radiusForm.errorFor('radius'),
        saving,
        saveCurrentLocation,
        generateQr,
    };
}