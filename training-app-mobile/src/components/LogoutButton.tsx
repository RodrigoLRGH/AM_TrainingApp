import { AppAlert } from './AppAlert';
import { IconButton } from 'react-native-paper';
import { useLogout } from '../features/auth/useLogout';

export function LogoutButton() {
    const { logout } = useLogout();

    function confirm() {
        AppAlert.alert('Cerrar sesión', '¿Quieres cerrar tu sesión?', [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Cerrar sesión', style: 'destructive', onPress: logout },
        ]);
    }

    return <IconButton icon="logout" onPress={confirm} accessibilityLabel="Cerrar sesión" />;
}