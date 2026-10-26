import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from 'react';
import { AppState } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { useAuth } from '../auth/AuthContext';
import { enqueueToggle, readQueue } from './queue';
import { flushQueue } from './sync';

const RETRY_EVERY_MS = 15000;

type SyncContextValue = {
    online: boolean;
    pending: number;
    failing: boolean;
    queueExercise: (exerciseId: string, completed: boolean) => Promise<void>;
};

const SyncContext = createContext<SyncContextValue | null>(null);

type ProviderProps = {
    children: ReactNode;
};

export function SyncProvider({ children }: ProviderProps) {
    const { session } = useAuth();
    const enabled = session?.role === 'CLIENTE';
    const [online, setOnline] = useState(true);
    const [pending, setPending] = useState(0);
    const [failing, setFailing] = useState(false);

    const syncNow = useCallback(async () => {
        if (!enabled) {
            return;
        }

        try {
            const result = await flushQueue();
            setPending(result.remaining);
            setFailing(result.remaining > 0);
        } catch (error) {
            console.warn('No se pudo sincronizar.', error);
        }
    }, [enabled]);

    useEffect(() => {
        if (!enabled) {
            setPending(0);
            setFailing(false);
            return;
        }

        async function loadPending() {
            try {
                const queue = await readQueue();
                setPending(Object.keys(queue).length);
            } catch (error) {
                console.warn('No se pudo leer la cola pendiente.', error);
            }
        }

        loadPending();
        syncNow();
    }, [enabled, syncNow]);

    useEffect(() => {
        if (!enabled) {
            return undefined;
        }

        const unsubscribe = NetInfo.addEventListener((state) => {
            const connected = state.isConnected !== false;
            setOnline(connected);
            if (connected) {
                syncNow();
            }
        });

        return unsubscribe;
    }, [enabled, syncNow]);

    useEffect(() => {
        if (!enabled) {
            return undefined;
        }

        const subscription = AppState.addEventListener('change', (status) => {
            if (status === 'active') {
                syncNow();
            }
        });

        return () => subscription.remove();
    }, [enabled, syncNow]);

    useEffect(() => {
        if (!enabled || !online || pending === 0) {
            return undefined;
        }

        const id = setInterval(syncNow, RETRY_EVERY_MS);
        return () => clearInterval(id);
    }, [enabled, online, pending, syncNow]);

    const queueExercise = useCallback(
        async (exerciseId: string, completed: boolean) => {
            await enqueueToggle(exerciseId, completed);
            const queue = await readQueue();
            setPending(Object.keys(queue).length);

            if (online) {
                syncNow();
            }
        },
        [online, syncNow],
    );

    const value = useMemo(
        () => ({ online, pending, failing, queueExercise }),
        [online, pending, failing, queueExercise],
    );

    return <SyncContext.Provider value={value}>{children}</SyncContext.Provider>;
}

export function useSync() {
    const context = useContext(SyncContext);

    if (!context) {
        throw new Error('useSync debe usarse dentro de SyncProvider');
    }

    return context;
}