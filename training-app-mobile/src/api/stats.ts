import { api } from './client';
import type { DashboardStats } from './types';

export async function getDashboard(days: number) {
    const to = new Date();
    const from = new Date(to.getTime() - days * 24 * 60 * 60 * 1000);

    const { data } = await api.get<DashboardStats>('/stats/dashboard', {
        params: {
            from: from.toISOString(),
            to: to.toISOString(),
        },
    });
    return data;
}