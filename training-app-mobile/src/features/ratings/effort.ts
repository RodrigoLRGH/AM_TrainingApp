export type EffortLevel = {
    value: number;
    label: string;
};

export const EFFORT_LEVELS: EffortLevel[] = [
    { value: 1, label: 'Muy ligero' },
    { value: 2, label: 'Ligero' },
    { value: 3, label: 'Moderado' },
    { value: 4, label: 'Intenso' },
    { value: 5, label: 'Máximo esfuerzo' },
];

export function effortLabel(value: number) {
    return EFFORT_LEVELS.find((level) => level.value === value)?.label ?? '';
}