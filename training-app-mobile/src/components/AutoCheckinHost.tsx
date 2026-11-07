import { Portal, Snackbar } from 'react-native-paper';
import { useAuth } from '../auth/AuthContext';
import { useAutoCheckin } from '../features/attendance/useAutoCheckin';

export function AutoCheckinHost() {
    const { session } = useAuth();
    const { message, dismiss } = useAutoCheckin(session?.role === 'CLIENTE');

    return (
        <Portal>
            <Snackbar visible={message !== null} onDismiss={dismiss} duration={5000}>
                {message ?? ''}
            </Snackbar>
        </Portal>
    );
}