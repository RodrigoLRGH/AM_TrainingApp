import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import type { Routine } from '../../api/types';
import { loadMyRoutines } from '../../offline/routines';
import { sortRoutines } from './sortRoutines';

export function useMyRoutines() {
    const [routines, setRoutines] = useState<Routine[]>([]);
    const [loading, setLoading] = useState(true);
    const [failed, setFailed] = useState(false);
    const [fromCache, setFromCache] = useState(false);

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const loaded = await loadMyRoutines();
            setRoutines(sortRoutines(loaded.routines));
            setFromCache(loaded.fromCache);
            setFailed(false);
        } catch (error) {
            setFailed(true);
        } finally {
            setLoading(false);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            load();
        }, [load]),
    );

    return { routines, loading, failed, fromCache };
}