import { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { getMyRoutines, setExerciseCompleted } from '../../api/routines';
import { getMyRatings } from '../../api/ratings';
import { getErrorMessage } from '../../api/errors';
import type { Routine } from '../../api/types';

export function useRoutineDetail(routineId: string) {
    const [routine, setRoutine] = useState<Routine | null>(null);
    const [rated, setRated] = useState(false);
    const [loading, setLoading] = useState(true);

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const [routines, ratings] = await Promise.all([getMyRoutines(), getMyRatings()]);
            setRoutine(routines.find((item) => item.id === routineId) ?? null);
            setRated(ratings.some((rating) => rating.routineId === routineId));
        } catch (error) {
            console.error(error);
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

        markExercise(exerciseId, !current.completed);
        try {
            await setExerciseCompleted(exerciseId, !current.completed);
        } catch (error) {
            markExercise(exerciseId, current.completed);
            Alert.alert(getErrorMessage(error, 'No se pudo guardar el cambio.'));
        }
    }

    return { routine, loading, rated, toggleExercise };
}