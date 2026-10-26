import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Routine } from '../api/types';

const QUEUE_KEY = 'offline.exerciseQueue';
const ROUTINES_KEY = 'offline.routines';

export type ExerciseQueue = Record<string, boolean>;

let lock: Promise<unknown> = Promise.resolve();

function exclusive<T>(task: () => Promise<T>): Promise<T> {
    const result = lock.then(task, task);
    lock = result.catch(() => undefined);
    return result;
}

function isQueue(value: unknown): value is ExerciseQueue {
    if (typeof value !== 'object' || value === null || Array.isArray(value)) {
        return false;
    }

    return Object.values(value).every((item) => typeof item === 'boolean');
}

async function readRaw(): Promise<ExerciseQueue> {
    const raw = await AsyncStorage.getItem(QUEUE_KEY);
    if (!raw) {
        return {};
    }

    try {
        const parsed: unknown = JSON.parse(raw);
        return isQueue(parsed) ? parsed : {};
    } catch {
        return {};
    }
}

export function readQueue() {
    return exclusive(readRaw);
}

export function enqueueToggle(exerciseId: string, completed: boolean) {
    return exclusive(async () => {
        const queue = await readRaw();
        queue[exerciseId] = completed;
        await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
    });
}

export function removeIfUnchanged(exerciseId: string, completed: boolean) {
    return exclusive(async () => {
        const queue = await readRaw();
        if (queue[exerciseId] === completed) {
            delete queue[exerciseId];
            await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
        }
    });
}

export async function readRoutinesCache(): Promise<Routine[] | null> {
    const raw = await AsyncStorage.getItem(ROUTINES_KEY);
    if (!raw) {
        return null;
    }

    try {
        const parsed: unknown = JSON.parse(raw);
        return Array.isArray(parsed) ? (parsed as Routine[]) : null;
    } catch {
        return null;
    }
}

export async function writeRoutinesCache(routines: Routine[]) {
    try {
        await AsyncStorage.setItem(ROUTINES_KEY, JSON.stringify(routines));
    } catch (error) {
        console.warn('No se pudo guardar la copia local de tus rutinas.', error);
    }
}

export function clearOfflineStorage() {
    return exclusive(() => AsyncStorage.multiRemove([QUEUE_KEY, ROUTINES_KEY]));
}