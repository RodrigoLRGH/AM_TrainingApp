import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { getMyRoutines } from '../../api/routines';
import type { Routine } from '../../api/types';
import { sortRoutines } from './sortRoutines';

export function useMyRoutines() {
    const [routines, setRoutines] = useState<Routine[]>([]);
    const [loading, setLoading] = useState(true);

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getMyRoutines();
            setRoutines(sortRoutines(data));
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            load();
        }, [load]),
    );

    return { routines, loading };
}