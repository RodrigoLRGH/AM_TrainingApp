import { useCallback, useEffect, useState } from 'react';
import { getMyRatings } from '../../api/ratings';
import type { Routine } from '../../api/types';
import { loadMyRoutines } from '../../offline/routines';
import { useSync } from '../../offline/SyncContext';

export function useRoutineDetail(routineId: string) {
    const { queueExercise } = useSync();
    const [routine, setRoutine] = useState<Routine | null>(null);
    const [rated, setRated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [fromCache, setFromCache] = useState(false);

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const loaded = await loadMyRoutines();
            setRoutine(loaded.routines.find((item) => item.id === routineId) ?? null);
            setFromCache(loaded.fromCache);

            if (!loaded.fromCache) {
                try {
                    const ratings = await getMyRatings();
                    setRated(ratings.some((rating) => rating.routineId === routineId));
                } catch (error) {
                    console.warn('No se pudieron cargar tus calificaciones.', error);
                }
            }
        } catch (error) {
            console.warn('No se pudo cargar la rutina.', error);
        } finally {
            setLoading(false);
        }
    }, [routineId]);

    useEffect(() => {
        load();
    }, [load]);

    function markExercise(exerciseId: string, completed: boolean) {
        setRoutine((prev) =>
            prev
                ? {
                    ...prev,
                    exercises: prev.exercises.map((exercise) =>
                        exercise.id === exerciseId ? { ...exercise, completed } : exercise,
                    ),
                }
                : prev,
        );
    }

    async function toggleExercise(exerciseId: string) {
        const current = routine?.exercises.find((exercise) => exercise.id === exerciseId);
        if (!current) {
            return;
        }

        const next = !current.completed;
        markExercise(exerciseId, next);
        await queueExercise(exerciseId, next);
    }

    return { routine, loading, rated, fromCache, toggleExercise };
}