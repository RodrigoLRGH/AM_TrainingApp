import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
    type ReactNode,
} from 'react';
import { useRouter } from 'expo-router';
import { setUnauthorizedHandler } from '../api/client';
import type { Role } from '../api/types';
import { clearSession, getRole, getToken, saveSession } from './storage';
import { usePushRegistration } from '../features/notifications/usePushRegistration';
import { Alert } from 'react-native';
import { resetOffline } from '../offline/sync';

type Session = {
    role: Role;
};

type AuthContextValue = {
    session: Session | null;
    loading: boolean;
    signIn: (token: string, role: Role) => Promise<void>;
    signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

type ProviderProps = {
    children: ReactNode;
};

export function AuthProvider({ children }: ProviderProps) {
    const router = useRouter();
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    const expiredRef = useRef(false);
    usePushRegistration(session !== null);

    useEffect(() => {
        let cancelled = false;

        async function restore() {
            try {
                const [token, role] = await Promise.all([getToken(), getRole()]);
                if (!cancelled && token && role) {
                    setSession({ role });
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        restore();

        return () => {
            cancelled = true;
        };
    }, []);

    const signIn = useCallback(async (token: string, role: Role) => {
        await saveSession(token, role);
        expiredRef.current = false;
        setSession({ role });
    }, []);

    const signOut = useCallback(async () => {
        await clearSession();
        await resetOffline();
        setSession(null);
    }, []);

    useEffect(() => {
        setUnauthorizedHandler(async (message?: string) => {
            if (expiredRef.current) {
                return;
            }

            expiredRef.current = true;
            await signOut();
            router.replace('/(auth)/login');

            if (message && message !== 'Unauthorized') {
                Alert.alert('Sesión terminada', message);
            }
        });

        return () => setUnauthorizedHandler(null);
    }, [signOut, router]);

    const value = useMemo(
        () => ({ session, loading, signIn, signOut }),
        [session, loading, signIn, signOut],
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth debe usarse dentro de AuthProvider');
    }

    return context;
}