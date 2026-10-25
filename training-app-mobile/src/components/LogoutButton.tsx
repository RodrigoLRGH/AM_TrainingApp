import { Alert } from 'react-native';
import { IconButton } from 'react-native-paper';
import { useLogout } from '../features/auth/useLogout';

export function LogoutButton() {
    const { logout } = useLogout();

    function confirm() {
        Alert.alert('Cerrar sesión', '¿Quieres cerrar tu sesión?', [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Cerrar sesión', style: 'destructive', onPress: logout },
        ]);
    }

    return <IconButton icon="logout" onPress={confirm} accessibilityLabel="Cerrar sesión" />;
}