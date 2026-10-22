import { api } from './client';
import type { Measurement, NewMeasurement } from './types';

export async function getMyMeasurements() {
    const { data } = await api.get<Measurement[]>('/measurements/me');
    return data;
}

export async function createMeasurement(payload: NewMeasurement) {
    const { data } = await api.post<Measurement>('/measurements', payload);
    return data;
}

export async function getClientMeasurements(clientId: string) {
    const { data } = await api.get<Measurement[]>(`/clients/${clientId}/measurements`);
    return data;
}
