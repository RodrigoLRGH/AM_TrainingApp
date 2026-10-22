import { useCallback, useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { getClientMeasurements } from '../../api/measurements';
import { getErrorMessage } from '../../api/errors';
import type { MeasureKey, Measurement } from '../../api/types';
import { seriesFor } from './metrics';

export function useClientMeasurements(clientId: string) {
    const [measurements, setMeasurements] = useState<Measurement[]>([]);
    const [loading, setLoading] = useState(true);
    const [metric, setMetric] = useState<MeasureKey>('weightKg');

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getClientMeasurements(clientId);
            setMeasurements(data);
        } catch (error) {
            Alert.alert(getErrorMessage(error, 'No se pudieron cargar las mediciones.'));
        } finally {
            setLoading(false);
        }
    }, [clientId]);

    useFocusEffect(
        useCallback(() => {
            load();
        }, [load]),
    );

    const series = useMemo(() => seriesFor(measurements, metric), [measurements, metric]);

    return { loading, metric, setMetric, series };
}