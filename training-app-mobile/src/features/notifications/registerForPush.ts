import { Platform } from 'react-native';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';

export async function registerForPushAsync(): Promise<string | null> {
    if (!Device.isDevice) {
        return null;
    }

    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
            name: 'Avisos',
            importance: Notifications.AndroidImportance.MAX,
        });
    }

    const current = await Notifications.getPermissionsAsync();
    let status = current.status;

    if (status !== 'granted') {
        const requested = await Notifications.requestPermissionsAsync();
        status = requested.status;
    }

    if (status !== 'granted') {
        return null;
    }

    const projectId: unknown =
        Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId;

    if (typeof projectId !== 'string') {
        console.warn('Notificaciones: falta el projectId de EAS. Corre "eas init".');
        return null;
    }

    const token = await Notifications.getExpoPushTokenAsync({ projectId });
    return token.data;
}