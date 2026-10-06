import { api } from './client';

export async function getMyRoutines(date?: string) {
    const { data } = await api.get('/routines/me', { params: date ? { date } : {} });
    return data;
}

export async function getRoutines(isTemplate?: boolean) {
    const { data } = await api.get('/routines', {
        params: isTemplate !== undefined ? { isTemplate } : {},
    });
    return data;
}

export async function createRoutine(payload: {
    title: string;
    isTemplate: boolean;
    exercises: { name: string; sets: number; reps: number }[];
}) {
    const { data } = await api.post('/routines', payload);
    return data;
}

export async function assignTemplate(
    templateId: string,
    payload: { clientIds: string[]; date: string },
) {
    const { data } = await api.post(`/routines/${templateId}/assign`, payload);
    return data;
}