import { ScrollView, StyleSheet } from 'react-native';
import { Text, Portal, Modal, TextInput, Button } from 'react-native-paper';
import type { MeasureKey } from '../api/types';
import { METRICS } from '../features/progress/metrics';
import type { MeasureForm } from '../features/progress/useMeasurements';

type Props = {
    visible: boolean;
    onDismiss: () => void;
    form: MeasureForm;
    onChange: (key: MeasureKey, value: string) => void;
    onSubmit: () => void;
    saving: boolean;
};

export function NewMeasurementModal({ visible, onDismiss, form, onChange, onSubmit, saving }: Props) {
    return (
        <Portal>
            <Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={styles.modal}>
                <Text variant="titleMedium" style={styles.title}>
                    Nueva medición
                </Text>
                <Text variant="bodySmall" style={styles.hint}>
                    Llena solo lo que te midas hoy.
                </Text>

                <ScrollView keyboardShouldPersistTaps="handled" style={styles.fields}>
                    {METRICS.map((item) => (
                        <TextInput
                            key={item.key}
                            label={`${item.label} (${item.unit})`}
                            value={form[item.key]}
                            onChangeText={(value) => onChange(item.key, value)}
                            keyboardType="decimal-pad"
                            style={styles.input}
                        />
                    ))}
                </ScrollView>

                <Button mode="contained" onPress={onSubmit} loading={saving} disabled={saving}>
                    Guardar
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
    input: {
        marginBottom: 12,
    },
});