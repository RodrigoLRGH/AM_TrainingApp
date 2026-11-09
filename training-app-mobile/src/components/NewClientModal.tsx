import { StyleSheet } from 'react-native';
import { Text, Portal, Modal, Button, useTheme } from 'react-native-paper';
import type { useForm } from '../features/forms/useForm';
import { FormField } from './FormField';

type Props = {
    visible: boolean;
    onDismiss: () => void;
    form: ReturnType<typeof useForm<{ name: string }>>;
    onSubmit: () => void;
    saving: boolean;
};

export function NewClientModal({ visible, onDismiss, form, onSubmit, saving }: Props) {
    const { colors } = useTheme();

    return (
        <Portal>
            <Modal
                visible={visible}
                onDismiss={onDismiss}
                contentContainerStyle={[styles.modal, { backgroundColor: colors.surface }]}
            >
                <Text variant="titleMedium" style={styles.title}>
                    Nuevo cliente
                </Text>
                <FormField
                    label="Nombre"
                    placeholder="Nombre completo del cliente"
                    value={form.values.name}
                    onChangeText={(value) => form.setValue('name', value)}
                    onBlur={() => form.handleBlur('name')}
                    error={form.errorFor('name')}
                    autoCapitalize="words"
                />
                <Button
                    mode="contained"
                    onPress={onSubmit}
                    loading={saving}
                    disabled={saving}
                    style={styles.submit}
                >
                    Crear
                </Button>
            </Modal>
        </Portal>
    );
}

const styles = StyleSheet.create({
    modal: {
        padding: 24,
        margin: 24,
        borderRadius: 8,
    },
    title: {
        marginBottom: 16,
    },
    submit: {
        marginTop: 8,
    },
});
