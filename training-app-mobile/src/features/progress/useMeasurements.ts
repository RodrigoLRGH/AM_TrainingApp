import { useCallback, useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { getMyMeasurements, createMeasurement } from '../../api/measurements';
import { getErrorMessage } from '../../api/errors';
import type { MeasureKey, Measurement, NewMeasurement } from '../../api/types';
import { METRICS, seriesFor } from './metrics';

export type MeasureForm = Record<MeasureKey, string>;

const EMPTY_FORM: MeasureForm = {
    weightKg: '',
    chestCm: '',
    waistCm: '',
    hipsCm: '',
    armCm: '',
    legCm: '',
};

export function useMeasurements() {
    const [measurements, setMeasurements] = useState<Measurement[]>([]);
    const [loading, setLoading] = useState(true);
    const [metric, setMetric] = useState<MeasureKey>('weightKg');
    const [modalVisible, setModalVisible] = useState(false);
    const [form, setForm] = useState<MeasureForm>(EMPTY_FORM);
    const [saving, setSaving] = useState(false);

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getMyMeasurements();
            setMeasurements(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            load();
        }, [load]),
    );

    const series = useMemo(() => seriesFor(measurements, metric), [measurements, metric]);

    function setField(key: MeasureKey, value: string) {
        setForm((prev) => ({ ...prev, [key]: value }));
    }

    async function submit() {
        const payload: NewMeasurement = {};

        for (const item of METRICS) {
            const raw = form[item.key].trim();
            if (!raw) {
                continue;
            }

            // Acepta coma o punto como separador decimal
            const value = Number(raw.replace(',', '.'));
            if (!Number.isFinite(value) || value <= 0) {
                Alert.alert(`"${item.label}" debe ser un número mayor a cero.`);
                return;
            }
            payload[item.key] = value;
        }

        if (Object.keys(payload).length === 0) {
            Alert.alert('Escribe al menos una medida.');
            return;
        }

        setSaving(true);
        try {
            await createMeasurement(payload);
            setForm(EMPTY_FORM);
            setModalVisible(false);
            await load();
        } catch (error) {
            Alert.alert(getErrorMessage(error, 'No se pudo guardar la medición.'));
        } finally {
            setSaving(false);
        }
    }

    return {
        measurements,
        loading,
        metric,
        setMetric,
        series,
        modalVisible,
        setModalVisible,
        form,
        setField,
        saving,
        submit,
    };
}