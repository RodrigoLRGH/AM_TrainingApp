import type { MeasureKey, Measurement } from '../../api/types';

export type Metric = {
    key: MeasureKey;
    label: string;
    unit: string;
};

export type ChartPoint = {
    value: number;
    date: string;
};

export const METRICS: Metric[] = [
    { key: 'weightKg', label: 'Peso', unit: 'kg' },
    { key: 'waistCm', label: 'Cintura', unit: 'cm' },
    { key: 'chestCm', label: 'Pecho', unit: 'cm' },
    { key: 'hipsCm', label: 'Cadera', unit: 'cm' },
    { key: 'armCm', label: 'Brazo', unit: 'cm' },
    { key: 'legCm', label: 'Pierna', unit: 'cm' },
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