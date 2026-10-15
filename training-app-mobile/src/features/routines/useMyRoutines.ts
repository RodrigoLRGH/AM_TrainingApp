import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { getMyRoutines } from '../../api/routines';
import type { Routine } from '../../api/types';

export function useMyRoutines() {
    const [routines, setRoutines] = useState<Routine[]>([]);
    const [loading, setLoading] = useState(true);
    const [completed, setCompleted] = useState<Record<string, boolean>>({});

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getMyRoutines();
            setRoutines(data);
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

    function toggleExercise(id: string) {
        setCompleted((prev) => ({ ...prev, [id]: !prev[id] }));
    }

    return { routines, loading, completed, toggleExercise };
}