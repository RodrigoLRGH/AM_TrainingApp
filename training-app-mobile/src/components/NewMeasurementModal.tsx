import { ScrollView, View, StyleSheet } from 'react-native';
import { Text, Portal, Modal, TextInput, Button, HelperText, useTheme } from 'react-native-paper';
import type { MeasureKey } from '../api/types';
import { METRICS } from '../features/progress/metrics';
import type { MeasureForm } from '../features/progress/useMeasurements';
import type { useForm } from '../features/forms/useForm';

type Props = {
    visible: boolean;
    onDismiss: () => void;
    form: ReturnType<typeof useForm<MeasureForm>>;
    onChange: (key: MeasureKey, value: string) => void;
    emptyError: string | null;
    onSubmit: () => void;
    saving: boolean;
};

export function NewMeasurementModal({
    visible,
    onDismiss,
    form,
    onChange,
    emptyError,
    onSubmit,
    saving,
}: Props) {
    const { colors } = useTheme();

    return (
        <Portal>
            <Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={[styles.modal, { backgroundColor: colors.surface }]}>
                <Text variant="titleMedium" style={styles.title}>
                    Nueva medición
                </Text>
                <Text variant="bodySmall" style={styles.hint}>
                    Llena solo lo que te midas hoy.
                </Text>

                <ScrollView keyboardShouldPersistTaps="handled" style={styles.fields}>
                    {METRICS.map((item) => {
                        const error = form.errorFor(item.key);
                        return (
                            <View key={item.key} style={styles.field}>
                                <TextInput
                                    mode="outlined"
                                    label={`${item.label} (${item.unit})`}
                                    value={form.values[item.key]}
                                    onChangeText={(value) => onChange(item.key, value)}
                                    onBlur={() => form.handleBlur(item.key)}
                                    error={!!error}
                                    keyboardType="decimal-pad"
                                />
                                {error ? <HelperText type="error">{error}</HelperText> : null}
                            </View>
                        );
                    })}
                </ScrollView>

                {emptyError ? <HelperText type="error">{emptyError}</HelperText> : null}

                <Button mode="contained" onPress={onSubmit} loading={saving} disabled={saving}>
                    Guardar
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
        maxHeight: '85%',
    },
    title: {
        marginBottom: 4,
    },
    hint: {
        color: '#666',
        marginBottom: 16,
    },
    fields: {
        marginBottom: 16,
    },
    field: {
        marginBottom: 8,
    },
});