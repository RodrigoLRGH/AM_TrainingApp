import { api } from './client';
import type { Client } from './types';

export async function getClients() {
    const { data } = await api.get<Client[]>('/clients');
    return data;
}

export async function createClient(name: string) {
    const { data } = await api.post<Client>('/clients', { name });
    return data;
}

export async function setClientActive(clientId: string, active: boolean) {
    const action = active ? 'activate' : 'deactivate';
    const { data } = await api.patch<Omit<Client, 'createdAt'>>(`/clients/${clientId}/${action}`);
    return data;
}