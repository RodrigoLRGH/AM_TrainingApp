import type { ReactNode } from 'react';
import { Keyboard, Pressable, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { Portal, Modal } from 'react-native-paper';

type Props = {
    visible: boolean;
    onDismiss: () => void;
    contentContainerStyle?: StyleProp<ViewStyle>;
    children: ReactNode;
};

/**
 * Modal para formularios con inputs:
 * - Tocar cualquier zona del modal que no sea un control cierra el teclado.
 * - Con el teclado abierto, tocar el fondo (o el botón atrás) solo cierra el
 *   teclado; el modal se cierra hasta el siguiente toque, así no se pierde lo escrito.
 *
 * Los ScrollView internos deben usar keyboardShouldPersistTaps="handled".
 */
export function FormModal({ visible, onDismiss, contentContainerStyle, children }: Props) {
    function handleDismiss() {
        if (Keyboard.isVisible()) {
            Keyboard.dismiss();
            return;
        }
        onDismiss();
    }

    return (
        <Portal>
            <Modal
                visible={visible}
                onDismiss={handleDismiss}
                contentContainerStyle={contentContainerStyle}
            >
                <Pressable onPress={Keyboard.dismiss} accessible={false} style={styles.content}>
                    {children}
                </Pressable>
            </Modal>
        </Portal>
    );
}

const styles = StyleSheet.create({
    // Permite que un ScrollView interno se encoja cuando el modal tiene maxHeight.
    content: {
        flexShrink: 1,
    },
});
