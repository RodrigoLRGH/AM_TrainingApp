import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { getDashboard } from '../../api/stats';
import type { DashboardStats } from '../../api/types';
import { loadErrorMessage } from '../../api/errors';

export type PeriodDays = 7 | 30 | 90;

export function useDashboard() {
    const [days, setDays] = useState<PeriodDays>(30);
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);

    const load = useCallback(async () => {
        setLoading(true);
        setLoadError(null);
        try {
            const data = await getDashboard(days);
            setStats(data);
        } catch (error) {
            setLoadError(loadErrorMessage(error, 'No se pudieron cargar las estadísticas.'));
        } finally {
            setLoading(false);
        }
    }, [days]);

    useFocusEffect(
        useCallback(() => {
            load();
        }, [load]),
    );

    return { stats, loading, loadError, reload: load, days, setDays };
}