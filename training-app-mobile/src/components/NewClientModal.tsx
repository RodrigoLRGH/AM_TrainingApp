import { StyleSheet } from 'react-native';
import { Text, Portal, Modal, TextInput, Button } from 'react-native-paper';

type Props = {
    visible: boolean;
    onDismiss: () => void;
    name: string;
    onNameChange: (value: string) => void;
    onSubmit: () => void;
    saving: boolean;
};

export function NewClientModal({
    visible,
    onDismiss,
    name,
    onNameChange,
    onSubmit,
    saving,
}: Props) {
    return (
        <Portal>
            <Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={styles.modal}>
                <Text variant="titleMedium" style={styles.title}>
                    Nuevo cliente
                </Text>
                <TextInput label="Nombre" value={name} onChangeText={onNameChange} style={styles.input} />
                <Button mode="contained" onPress={onSubmit} loading={saving} disabled={saving}>
                    Crear
                </Button>
            </Modal>
        </Portal>
    );
}

const styles = StyleSheet.create({
    modal: {
        backgroundColor: 'white',
        padding: 24,
        margin: 24,
        borderRadius: 8,
    },
    title: {
        marginBottom: 16,
    },
    input: {
        marginBottom: 16,
    },
});