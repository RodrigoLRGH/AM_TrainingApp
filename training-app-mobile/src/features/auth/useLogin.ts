import { useState } from 'react';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import { api } from '../../api/client';
import { saveSession } from '../../auth/storage';

export type LoginMode = 'instructor' | 'client';

export function useLogin() {
    const [mode, setMode] = useState<LoginMode>('client');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [clientCode, setClientCode] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleLogin() {
        setLoading(true);
        try {
            if (mode === 'instructor') {
                const { data } = await api.post('/auth/instructor/login', { email, password });
                await saveSession(data.accessToken, 'INSTRUCTOR');
                router.replace('/(instructor)/clients');
            } else {
                const { data } = await api.post('/auth/client/login', { clientCode });
                await saveSession(data.accessToken, 'CLIENTE');
                router.replace('/(client)/routine');
            }
        } catch (error) {
            Alert.alert('Algo salió mal, intenta de nuevo.');
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