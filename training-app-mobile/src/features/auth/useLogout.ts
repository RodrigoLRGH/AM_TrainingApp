import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../auth/AuthContext';
import { useSync } from '../../offline/SyncContext';

export function useLogout() {
    const router = useRouter();
    const { signOut } = useAuth();
    const { pending } = useSync();

    async function logout() {
        await signOut();
        router.replace('/(auth)/login');
    }

    function confirmLogout() {
        const message =
            pending > 0
                ? `Tienes ${pending} ${pending === 1 ? 'cambio' : 'cambios'} sin enviar al servidor. Si cierras sesión ahora, se perderán.`
                : '¿Quieres cerrar tu sesión?';

        Alert.alert('Cerrar sesión', message, [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Cerrar sesión', style: 'destructive', onPress: logout },
        ]);
    }

    return { logout, confirmLogout };
}