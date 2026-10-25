import { useState } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { loginInstructor, loginClient } from '../../api/auth';
import { getErrorMessage } from '../../api/errors';
import { useAuth } from '../../auth/AuthContext';

export type LoginMode = 'instructor' | 'client';

export function useLogin() {
    const router = useRouter();
    const { signIn } = useAuth();
    const [mode, setMode] = useState<LoginMode>('client');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [clientCode, setClientCode] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleLogin() {
        setLoading(true);
        try {
            if (mode === 'instructor') {
                const data = await loginInstructor(email.trim(), password);
                await signIn(data.accessToken, 'INSTRUCTOR');
                router.replace('/(instructor)/clients');
            } else {
                const data = await loginClient(clientCode.trim());
                await signIn(data.accessToken, 'CLIENTE');
                router.replace('/(client)/routine');
            }
        } catch (error) {
            Alert.alert(getErrorMessage(error, 'Algo salió mal, intenta de nuevo.'));
        } finally {
            setLoading(false);
        }
    }

    return {
        mode,
        setMode,
        email,
        setEmail,
        password,
        setPassword,
        clientCode,
        setClientCode,
        loading,
        handleLogin,
    };
}