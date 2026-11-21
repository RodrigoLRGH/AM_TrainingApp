import type { MeasureKey, Measurement } from '../../api/types';
import { LIMITS } from '../forms/limits';

export type Metric = {
    key: MeasureKey;
    label: string;
    unit: string;
    /** Valor máximo aceptado, para evitar errores de dedo que arruinen la gráfica. */
    max: number;
};

export type ChartPoint = {
    value: number;
    date: string;
};

export const METRICS: Metric[] = [
    { key: 'weightKg', label: 'Peso', unit: 'kg', max: LIMITS.weightKg },
    { key: 'waistCm', label: 'Cintura', unit: 'cm', max: LIMITS.bodyCm },
    { key: 'chestCm', label: 'Pecho', unit: 'cm', max: LIMITS.bodyCm },
    { key: 'hipsCm', label: 'Cadera', unit: 'cm', max: LIMITS.bodyCm },
    { key: 'armCm', label: 'Brazo', unit: 'cm', max: LIMITS.bodyCm },
    { key: 'legCm', label: 'Pierna', unit: 'cm', max: LIMITS.bodyCm },
];

export function seriesFor(measurements: Measurement[], key: MeasureKey) {
    const points: ChartPoint[] = [];

    for (const measurement of measurements) {
        const value = measurement[key];
        if (value !== null) {
            points.push({ value, date: measurement.recordedAt });
        }
    }

    return points;
}