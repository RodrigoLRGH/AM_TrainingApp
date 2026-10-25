import { useEffect, useRef } from 'react';
import { useRouter } from 'expo-router';
import * as Notifications from 'expo-notifications';
import { useAuth } from '../auth/AuthContext';

function readType(data: Record<string, unknown> | undefined) {
    const type = data?.type;
    return typeof type === 'string' ? type : null;
}

export function NotificationObserver() {
    const router = useRouter();
    const { session, loading } = useAuth();
    const response = Notifications.useLastNotificationResponse();
    const handledRef = useRef<string | null>(null);

    useEffect(() => {
        if (!response || loading || !session) {
            return;
        }

        if (response.actionIdentifier !== Notifications.DEFAULT_ACTION_IDENTIFIER) {
            return;
        }

        const id = response.notification.request.identifier;
        if (handledRef.current === id) {
            return;
        }
        handledRef.current = id;

        const type = readType(response.notification.request.content.data);

        if (type === 'announcement') {
            router.push('/announcements');
        }
        if (type === 'routine' && session.role === 'CLIENTE') {
            router.push('/(client)/routine');
        }
    }, [response, loading, session, router]);

    return null;
}