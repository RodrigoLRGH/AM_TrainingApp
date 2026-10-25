import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { getInstructorAnnouncements, getMyAnnouncements } from '../../api/announcements';
import type { Announcement } from '../../api/types';

export function useAnnouncements(isInstructor: boolean) {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchAll = useCallback(() => {
        return isInstructor ? getInstructorAnnouncements() : getMyAnnouncements();
    }, [isInstructor]);

    const load = useCallback(async () => {
        setLoading(true);
        try {
            setAnnouncements(await fetchAll());
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [fetchAll]);

    const refresh = useCallback(async () => {
        setRefreshing(true);
        try {
            setAnnouncements(await fetchAll());
        } catch (error) {
            console.error(error);
        } finally {
            setRefreshing(false);
        }
    }, [fetchAll]);

    useFocusEffect(
        useCallback(() => {
            load();
        }, [load]),
    );

    return { announcements, loading, refreshing, refresh };
}