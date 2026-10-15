import { api } from './client';
import type { AuthResponse } from './types';

export async function loginInstructor(email: string, password: string) {
    const { data } = await api.post<AuthResponse>('/auth/instructor/login', { email, password });
    return data;
}

export async function loginClient(clientCode: string) {
    const { data } = await api.post<AuthResponse>('/auth/client/login', { clientCode });
    return data;
}