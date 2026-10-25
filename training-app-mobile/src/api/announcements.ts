import { api } from './client';
import type { Announcement } from './types';

export async function getInstructorAnnouncements() {
    const { data } = await api.get<Announcement[]>('/announcements');
    return data;
}

export async function getMyAnnouncements() {
    const { data } = await api.get<Announcement[]>('/announcements/me');
    return data;
}

export async function createAnnouncement(payload: { title: string; message: string }) {
    const { data } = await api.post<Announcement>('/announcements', payload);
    return data;
}

export async function registerPushToken(pushToken: string) {
    const { data } = await api.post<{ id: string; pushToken: string | null }>('/push-token', {
        pushToken,
    });
    return data;
}