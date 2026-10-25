import { api } from './client';
import type { NewSessionRating, SessionRating } from './types';

export async function createSessionRating(payload: NewSessionRating) {
    const { data } = await api.post<SessionRating>('/session-ratings', payload);
    return data;
}

export async function getClientRatings(clientId: string) {
    const { data } = await api.get<SessionRating[]>(`/clients/${clientId}/session-ratings`);
    return data;
}

export async function getMyRatings() {
    const { data } = await api.get<SessionRating[]>('/session-ratings/me');
    return data;
}