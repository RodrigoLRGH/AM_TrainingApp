import { Linking } from 'react-native';
import { AppAlert } from '../../components/AppAlert';

/**
 * Avisa que se negó un permiso.
 *
 * Si el sistema ya no puede volver a preguntar (el usuario lo negó de forma permanente),
 * la única forma de activarlo es desde los ajustes del teléfono, así que se ofrece abrirlos.
 *
 * @param message Por qué se necesita el permiso, p. ej. "Necesitamos permiso de la cámara para…".
 * @param canAskAgain El valor `canAskAgain` que regresa la solicitud del permiso.
 */
export function alertPermissionDenied(message: string, canAskAgain: boolean) {
    if (canAskAgain) {
        AppAlert.alert(message);
        return;
    }

    AppAlert.alert('Permiso desactivado', `${message} Actívalo en los ajustes de tu teléfono.`, [
        { text: 'Ahora no', style: 'cancel' },
        {
            text: 'Abrir ajustes',
            onPress: () => {
                Linking.openSettings().catch(() => undefined);
            },
        },
    ]);
}
