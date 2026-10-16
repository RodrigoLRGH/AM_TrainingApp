import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { getDashboard } from '../../api/stats';
import type { DashboardStats } from '../../api/types';

export type PeriodDays = 7 | 30 | 90;

export function useDashboard() {
    const [days, setDays] = useState<PeriodDays>(30);
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getDashboard(days);
            setStats(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [days]);

    useFocusEffect(
        useCallback(() => {
            load();
        }, [load]),
    );

    return { stats, loading, days, setDays };
}