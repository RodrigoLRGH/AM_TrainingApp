import { api } from './client';
import type { RunPointInput, RunSession } from './types';

export async function startRun() {
    const { data } = await api.post<RunSession>('/running/start');
    return data;
}

export async function addRunPoints(sessionId: string, points: RunPointInput[]) {
    const { data } = await api.post<RunSession>(`/running/${sessionId}/points`, { points });
    return data;
}

export async function finishRun(sessionId: string) {
    const { data } = await api.post<RunSession>(`/running/${sessionId}/finish`);
    return data;
}

export async function getRun(sessionId: string) {
    const { data } = await api.get<RunSession>(`/running/${sessionId}`);
    return data;
}

export async function getRuns() {
    const { data } = await api.get<RunSession[]>('/running');
    return data;
}