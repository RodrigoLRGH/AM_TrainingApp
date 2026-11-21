import type { ReactNode } from 'react';
import {
    Keyboard,
    Pressable,
    StyleSheet,
    useWindowDimensions,
    type StyleProp,
    type ViewStyle,
} from 'react-native';
import { Portal, Modal } from 'react-native-paper';

type Props = {
    visible: boolean;
    onDismiss: () => void;
    contentContainerStyle?: StyleProp<ViewStyle>;
    children: ReactNode;
};

/** Alto máximo del modal respecto a la pantalla; si el contenido no cabe, su ScrollView hace scroll. */
const MAX_HEIGHT_RATIO = 0.85;

/**
 * Modal para formularios con inputs:
 * - Tocar cualquier zona del modal que no sea un control cierra el teclado.
 * - Con el teclado abierto, tocar el fondo (o el botón atrás) solo cierra el
 *   teclado; el modal se cierra hasta el siguiente toque, así no se pierde lo escrito.
 * - La caja se ajusta a su contenido (sin espacio sobrante) con un alto máximo en píxeles.
 *
 * Los ScrollView internos deben usar keyboardShouldPersistTaps="handled".
 */
export function FormModal({ visible, onDismiss, contentContainerStyle, children }: Props) {
    const { height } = useWindowDimensions();

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
                contentContainerStyle={[
                    contentContainerStyle,
                    styles.surface,
                    // Paper aplica maxHeight a una capa interna cuyo padre no tiene alto definido,
                    // así que un porcentaje no limita bien; se calcula en píxeles.
                    { maxHeight: height * MAX_HEIGHT_RATIO },
                ]}
            >
                <Pressable onPress={Keyboard.dismiss} accessible={false} style={styles.content}>
                    {children}
                </Pressable>
            </Modal>
        </Portal>
    );
}

const styles = StyleSheet.create({
    // Paper centra el contenido del Surface; si la caja queda más alta que su contenido,
    // eso deja espacio arriba y abajo. Se alinea arriba para que no sobre espacio.
    surface: {
        justifyContent: 'flex-start',
    },
    // Permite que un ScrollView interno se encoja cuando se alcanza el alto máximo.
    content: {
        flexShrink: 1,
    },
});
