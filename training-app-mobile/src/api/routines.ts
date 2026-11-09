import { api } from './client';
import type { Exercise, NewExercise, Routine, Template } from './types';

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

export type ClientExercises = { clientId: string; exercises: NewExercise[] };

export async function assignTemplate(
    templateId: string,
    payload: { clientIds: string[]; date: string; overrides?: ClientExercises[] },
) {
    const { data } = await api.post<Routine[]>(`/routines/${templateId}/assign`, payload);
    return data;
}

export async function setExerciseCompleted(exerciseId: string, completed: boolean) {
    const { data } = await api.patch<Exercise>(`/routines/exercises/${exerciseId}/completed`, {
        completed,
    });
    return data;
}

export async function updateTemplate(
    templateId: string,
    payload: { title: string; exercises: NewExercise[] },
) {
    const { data } = await api.patch<Template>(`/routines/${templateId}`, payload);
    return data;
}

export async function deleteTemplate(templateId: string) {
    const { data } = await api.delete<{ id: string }>(`/routines/${templateId}`);
    return data;
}

export async function getClientRoutines(clientId: string) {
    const { data } = await api.get<Routine[]>('/routines', {
        params: { isTemplate: false, clientId },
    });
    return data;
}

export async function updateRoutine(
    routineId: string,
    payload: { title: string; date: string; exercises: NewExercise[] },
) {
    const { data } = await api.patch<Routine>(`/routines/${routineId}`, payload);
    return data;
}

export async function deleteRoutine(routineId: string) {
    const { data } = await api.delete<{ id: string }>(`/routines/${routineId}`);
    return data;
}
