import { api } from './client';
import type { NewExercise, Routine, Template } from './types';

export async function getMyRoutines(date?: string) {
    const { data } = await api.get<Routine[]>('/routines/me', {
        params: date ? { date } : {},
    });
    return data;
}

export async function getTemplates() {
    const { data } = await api.get<Template[]>('/routines', {
        params: { isTemplate: true },
    });
    return data;
}

export async function createTemplate(payload: { title: string; exercises: NewExercise[] }) {
    const { data } = await api.post<Template>('/routines', { ...payload, isTemplate: true });
    return data;
}

export async function assignTemplate(
    templateId: string,
    payload: { clientIds: string[]; date: string },
) {
    const { data } = await api.post<Routine[]>(`/routines/${templateId}/assign`, payload);
    return data;
}