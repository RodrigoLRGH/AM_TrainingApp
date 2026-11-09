import { useCallback, useMemo, useState } from 'react';
import { AppAlert } from '../../components/AppAlert';
import { useFocusEffect } from 'expo-router';
import { getMyMeasurements, createMeasurement } from '../../api/measurements';
import { getErrorMessage } from '../../api/errors';
import type { MeasureKey, Measurement, NewMeasurement } from '../../api/types';
import { METRICS, seriesFor } from './metrics';
import { useForm, type Rules } from '../forms/useForm';
import { optionalPositiveNumber } from '../forms/rules';

export type MeasureForm = Record<MeasureKey, string>;

const EMPTY_FORM: MeasureForm = {
    weightKg: '',
    chestCm: '',
    waistCm: '',
    hipsCm: '',
    armCm: '',
    legCm: '',
};

const RULES: Rules<MeasureForm> = Object.fromEntries(
    METRICS.map((item) => [item.key, optionalPositiveNumber('Debe ser un número mayor a cero.')]),
);

export function useMeasurements() {
    const [measurements, setMeasurements] = useState<Measurement[]>([]);
    const [loading, setLoading] = useState(true);
    const [metric, setMetric] = useState<MeasureKey>('weightKg');
    const [modalVisible, setModalVisible] = useState(false);
    const form = useForm<MeasureForm>(EMPTY_FORM, RULES);
    const [emptyError, setEmptyError] = useState<string | null>(null);
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
        form.setValue(key, value);
        setEmptyError(null);
    }

    function openModal() {
        form.reset();
        setEmptyError(null);
        setModalVisible(true);
    }

    async function submit() {
        if (!form.validate()) {
            return;
        }

        const payload: NewMeasurement = {};
        for (const item of METRICS) {
            const raw = form.values[item.key].trim();
            if (raw) {
                // Acepta coma o punto como separador decimal
                payload[item.key] = Number(raw.replace(',', '.'));
            }
        }

        if (Object.keys(payload).length === 0) {
            setEmptyError('Escribe al menos una medida.');
            return;
        }

        setSaving(true);
        try {
            await createMeasurement(payload);
            form.reset();
            setModalVisible(false);
            await load();
        } catch (error) {
            AppAlert.alert(getErrorMessage(error, 'No se pudo guardar la medición.'));
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
        openModal,
        form,
        setField,
        emptyError,
        saving,
        submit,
    };
}