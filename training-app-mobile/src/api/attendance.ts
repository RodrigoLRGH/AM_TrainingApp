import { api } from './client';
import type { AttendanceRecord, CheckinResult, GymConfig } from './types';

export type { AttendanceRecord } from './types';

export async function getGymConfig() {
    const { data } = await api.get<GymConfig>('/attendance/gym');
    return data;
}

export async function setGymLocation(payload: {
    latitude: number;
    longitude: number;
    radiusMeters: number;
}) {
    const { data } = await api.post<{
        id: string;
        gymLatitude: number;
        gymLongitude: number;
        gymRadiusMeters: number;
    }>('/attendance/gym-location', payload);
    return data;
}

export async function generateGymQr() {
    const { data } = await api.post<{ id: string; gymQrCode: string }>('/attendance/gym-qr');
    return data;
}

export async function checkinGeo(payload: { latitude: number; longitude: number }) {
    const { data } = await api.post<CheckinResult>('/attendance/checkin/geo', payload);
    return data;
}

export async function checkinQr(qrCode: string) {
    const { data } = await api.post<CheckinResult>('/attendance/checkin/qr', { qrCode });
    return data;
}

export async function getAttendanceCalendar(clientId?: string) {
    const { data } = await api.get<AttendanceRecord[]>('/attendance/calendar', {
        params: clientId ? { clientId } : {},
    });
    return data;
}