import { useSyncExternalStore } from 'react';
import { StyleSheet } from 'react-native';
import { Button, Dialog, Portal, Text, useTheme } from 'react-native-paper';

export type AppAlertButton = {
    text: string;
    style?: 'default' | 'cancel' | 'destructive';
    onPress?: () => void | Promise<void>;
};

export type AppAlertOptions = {
    onDismiss?: () => void;
};

type AlertRequest = {
    id: number;
    title: string;
    message?: string;
    buttons: AppAlertButton[];
    options?: AppAlertOptions;
};

let nextId = 1;
let queue: AlertRequest[] = [];
const listeners = new Set<() => void>();

function emit() {
    listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
    listeners.add(listener);
    return () => {
        listeners.delete(listener);
    };
}

function getSnapshot() {
    return queue;
}

/**
 * Reemplazo de Alert.alert con la misma firma, pero mostrado como un modal
 * de la app. Requiere que <AppAlertHost /> esté montado en el layout raíz.
 */
function alert(
    title: string,
    message?: string,
    buttons?: AppAlertButton[],
    options?: AppAlertOptions,
) {
    // Un doble toque en el botón que abre la alerta (p. ej. "Eliminar") no debe
    // encolar dos alertas iguales.
    if (queue.some((item) => item.title === title && item.message === message)) {
        return;
    }

    const request: AlertRequest = {
        id: nextId++,
        title,
        message,
        buttons: buttons && buttons.length > 0 ? buttons : [{ text: 'Aceptar' }],
        options,
    };
    queue = [...queue, request];
    emit();
}

/** Quita la alerta de la cola. Regresa false si ya se había cerrado. */
function close(id: number) {
    if (!queue.some((item) => item.id === id)) {
        return false;
    }
    queue = queue.filter((item) => item.id !== id);
    emit();
    return true;
}

export const AppAlert = { alert };

export function AppAlertHost() {
    const theme = useTheme();
    const items = useSyncExternalStore(subscribe, getSnapshot);

    const current = items[0];
    if (!current) {
        return null;
    }

    const cancelButton = current.buttons.find((button) => button.style === 'cancel');
    // Solo se puede cerrar tocando fuera si hay una opción de cancelar
    // o si la alerta es informativa (sin acciones personalizadas).
    const dismissable = cancelButton !== undefined || current.buttons.every((b) => !b.onPress);

    // Si la alerta ya se cerró (un segundo toque antes de que desaparezca),
    // la acción no se vuelve a ejecutar.
    function handlePress(button: AppAlertButton) {
        if (!close(current.id)) {
            return;
        }
        button.onPress?.();
    }

    function handleDismiss() {
        if (!close(current.id)) {
            return;
        }
        if (cancelButton?.onPress) {
            cancelButton.onPress();
        } else {
            current.options?.onDismiss?.();
        }
    }

    // Si no hay mensaje (p. ej. AppAlert.alert('Guardado')), solo se muestra el título.
    const body = current.message;

    return (
        <Portal>
            <Dialog
                key={current.id}
                visible
                dismissable={dismissable}
                dismissableBackButton={dismissable}
                onDismiss={handleDismiss}
                style={styles.dialog}
            >
                <Dialog.Title style={body ? undefined : styles.titleOnly}>{current.title}</Dialog.Title>
                {body ? (
                    <Dialog.Content>
                        <Text variant="bodyMedium">{body}</Text>
                    </Dialog.Content>
                ) : null}
                <Dialog.Actions style={styles.actions}>
                    {current.buttons.map((button, index) => {
                        const isLast = index === current.buttons.length - 1;
                        const isDestructive = button.style === 'destructive';
                        return (
                            <Button
                                key={`${button.text}-${index}`}
                                mode={isLast && button.style !== 'cancel' ? 'contained' : 'text'}
                                buttonColor={isDestructive && isLast ? theme.colors.error : undefined}
                                textColor={
                                    isDestructive && !isLast ? theme.colors.error : undefined
                                }
                                onPress={() => handlePress(button)}
                                style={styles.button}
                            >
                                {button.text}
                            </Button>
                        );
                    })}
                </Dialog.Actions>
            </Dialog>
        </Portal>
    );
}

const styles = StyleSheet.create({
    dialog: {
        borderRadius: 20,
    },
    titleOnly: {
        marginBottom: 8,
    },
    actions: {
        flexWrap: 'wrap',
        justifyContent: 'flex-end',
        gap: 8,
    },
    button: {
        minWidth: 88,
    },
});
