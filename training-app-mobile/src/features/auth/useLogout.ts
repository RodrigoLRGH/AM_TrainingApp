import { useRouter } from 'expo-router';
import { useAuth } from '../../auth/AuthContext';

export function useLogout() {
    const router = useRouter();
    const { signOut } = useAuth();

    async function logout() {
        await signOut();
        router.replace('/(auth)/login');
    }

    return { logout };
}