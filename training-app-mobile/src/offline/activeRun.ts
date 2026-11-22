import AsyncStorage from '@react-native-async-storage/async-storage';
import type { RunPointInput } from '../api/types';

export const ACTIVE_RUN_KEY = 'offline.activeRun';

/**
 * Corrida en curso guardada en el teléfono, para poder continuarla o terminarla
 * si la app se cierra a la mitad.
 */
export type ActiveRun = {
    sessionId: string;
    /** Inicio de la corrida (milisegundos desde 1970). */
    startedAt: number;
    /** Puntos registrados que todavía no llegan al servidor. */
    pending: RunPointInput[];
    /** Hora del último punto registrado (ISO), o null si aún no hay puntos. */
    lastPointAt: string | null;
};

function isActiveRun(value: unknown): value is ActiveRun {
    if (typeof value !== 'object' || value === null) {
        return false;
    }
    const run = value as Partial<ActiveRun>;
    return (
        typeof run.sessionId === 'string' &&
        typeof run.startedAt === 'number' &&
        Array.isArray(run.pending)
    );
}

export async function readActiveRun(): Promise<ActiveRun | null> {
    try {
        const raw = await AsyncStorage.getItem(ACTIVE_RUN_KEY);
        if (!raw) {
            return null;
        }
        const parsed: unknown = JSON.parse(raw);
        return isActiveRun(parsed) ? parsed : null;
    } catch {
        return null;
    }
}

export async function saveActiveRun(run: ActiveRun) {
    try {
        await AsyncStorage.setItem(ACTIVE_RUN_KEY, JSON.stringify(run));
    } catch (error) {
        console.warn('No se pudo guardar la corrida en el teléfono.', error);
    }
}

export async function clearActiveRun() {
    try {
        await AsyncStorage.removeItem(ACTIVE_RUN_KEY);
    } catch (error) {
        console.warn('No se pudo borrar la corrida guardada.', error);
    }
}
