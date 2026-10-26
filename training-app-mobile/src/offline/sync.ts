import { setExerciseCompleted } from '../api/routines';
import { shouldRetry } from '../api/errors';
import { clearOfflineStorage, readQueue, removeIfUnchanged } from './queue';

export type FlushResult = {
    synced: number;
    dropped: number;
    remaining: number;
};

let running: Promise<FlushResult> | null = null;

async function doFlush(): Promise<FlushResult> {
    const queue = await readQueue();
    let synced = 0;
    let dropped = 0;

    for (const [exerciseId, completed] of Object.entries(queue)) {
        try {
            await setExerciseCompleted(exerciseId, completed);
            synced += 1;
        } catch (error) {
            if (shouldRetry(error)) {
                break;
            }

            dropped += 1;
        }

        await removeIfUnchanged(exerciseId, completed);
    }

    const remaining = Object.keys(await readQueue()).length;
    return { synced, dropped, remaining };
}

export function flushQueue() {
    if (!running) {
        running = doFlush().finally(() => {
            running = null;
        });
    }

    return running;
}

export async function resetOffline() {
    running = null;
    await clearOfflineStorage();
}