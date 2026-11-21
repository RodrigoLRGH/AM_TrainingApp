import { setExerciseCompleted } from '../api/routines';
import { shouldRetry } from '../api/errors';
import { clearOfflineStorage, readQueue, removeIfUnchanged } from './queue';

export type FlushResult = {
    synced: number;
    dropped: number;
    remaining: number;
    /** true solo si el servidor no respondió (sin red, timeout o error 5xx). */
    failed: boolean;
};

let running: Promise<FlushResult> | null = null;

async function doFlush(): Promise<FlushResult> {
    const queue = await readQueue();
    let synced = 0;
    let dropped = 0;
    let failed = false;

    for (const [exerciseId, completed] of Object.entries(queue)) {
        try {
            await setExerciseCompleted(exerciseId, completed);
            synced += 1;
        } catch (error) {
            if (shouldRetry(error)) {
                failed = true;
                break;
            }

            dropped += 1;
        }

        await removeIfUnchanged(exerciseId, completed);
    }

    const remaining = Object.keys(await readQueue()).length;
    return { synced, dropped, remaining, failed };
}

/**
 * Envía la cola al servidor, un envío a la vez.
 *
 * Cada envío trabaja con la cola tal como estaba al empezar. Si llegan cambios mientras
 * hay un envío en curso (p. ej. al marcar ejercicios rápido), se espera a que termine y
 * se hace otro envío, para que esos cambios no se queden pendientes hasta el siguiente reintento.
 */
export function flushQueue(): Promise<FlushResult> {
    if (running) {
        return running.catch(() => undefined).then(() => flushQueue());
    }

    running = doFlush().finally(() => {
        running = null;
    });
    return running;
}

export async function resetOffline() {
    running = null;
    await clearOfflineStorage();
}