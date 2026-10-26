import { getMyRoutines } from '../api/routines';
import { shouldRetry } from '../api/errors';
import type { Routine } from '../api/types';
import { readQueue, readRoutinesCache, writeRoutinesCache, type ExerciseQueue } from './queue';

function applyQueue(routines: Routine[], queue: ExerciseQueue): Routine[] {
    if (Object.keys(queue).length === 0) {
        return routines;
    }

    return routines.map((routine) => ({
        ...routine,
        exercises: routine.exercises.map((exercise) =>
            exercise.id in queue ? { ...exercise, completed: queue[exercise.id] } : exercise,
        ),
    }));
}

export type LoadedRoutines = {
    routines: Routine[];
    fromCache: boolean;
};

export async function loadMyRoutines(): Promise<LoadedRoutines> {
    try {
        const fresh = await getMyRoutines();
        await writeRoutinesCache(fresh);
        return { routines: applyQueue(fresh, await readQueue()), fromCache: false };
    } catch (error) {
        if (!shouldRetry(error)) {
            throw error;
        }

        const cached = await readRoutinesCache();
        if (!cached) {
            throw error;
        }

        return { routines: applyQueue(cached, await readQueue()), fromCache: true };
    }
}