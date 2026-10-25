import { useEffect } from 'react';
import { registerPushToken } from '../../api/announcements';
import { registerForPushAsync } from './registerForPush';

export function usePushRegistration(enabled: boolean) {
    useEffect(() => {
        if (!enabled) {
            return undefined;
        }

        let cancelled = false;

        async function register() {
            try {
                const token = await registerForPushAsync();
                if (token && !cancelled) {
                    await registerPushToken(token);
                }
            } catch (error) {
                console.warn('No se pudo registrar el dispositivo para notificaciones.', error);
            }
        }

        register();

        return () => {
            cancelled = true;
        };
    }, [enabled]);
}