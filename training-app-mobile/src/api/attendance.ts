import { api } from './client';

export async function getGymConfig() {
    const { data } = await api.get('/attendance/gym');
    return data;
}

export async function setGymLocation(payload: {
    latitude: number;
    longitude: number;
    radiusMeters: number;
}) {
    const { data } = await api.post('/attendance/gym-location', payload);
    return data;
}

export async function generateGymQr() {
    const { data } = await api.post('/attendance/gym-qr');
    return data;
}