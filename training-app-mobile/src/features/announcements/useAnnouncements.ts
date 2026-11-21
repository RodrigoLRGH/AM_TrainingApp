import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { getInstructorAnnouncements, getMyAnnouncements } from '../../api/announcements';
import type { Announcement } from '../../api/types';
import { loadErrorMessage } from '../../api/errors';

export function useAnnouncements(isInstructor: boolean) {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);
    const [refreshing, setRefreshing] = useState(false);

    const fetchAll = useCallback(() => {
        return isInstructor ? getInstructorAnnouncements() : getMyAnnouncements();
    }, [isInstructor]);

    const load = useCallback(async () => {
        setLoading(true);
        setLoadError(null);
        try {
            setAnnouncements(await fetchAll());
        } catch (error) {
            setLoadError(loadErrorMessage(error, 'No se pudieron cargar los avisos.'));
        } finally {
            setLoading(false);
        }
    }, [fetchAll]);

    const refresh = useCallback(async () => {
        setRefreshing(true);
        setLoadError(null);
        try {
            setAnnouncements(await fetchAll());
        } catch (error) {
            setLoadError(loadErrorMessage(error, 'No se pudieron cargar los avisos.'));
        } finally {
            setRefreshing(false);
        }
    }, [fetchAll]);

    useFocusEffect(
        useCallback(() => {
            load();
        }, [load]),
    );

    return { announcements, loading, loadError, reload: load, refreshing, refresh };
}