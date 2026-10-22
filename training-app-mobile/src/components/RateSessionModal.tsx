import { StyleSheet } from 'react-native';
import { Text, Portal, Modal, TextInput, Button, SegmentedButtons } from 'react-native-paper';
import { EFFORT_LEVELS, effortLabel } from '../features/ratings/effort';

type Props = {
    visible: boolean;
    routineTitle: string;
    onDismiss: () => void;
    effort: number | null;
    onEffortChange: (value: number) => void;
    note: string;
    onNoteChange: (value: string) => void;
    onSubmit: () => void;
    saving: boolean;
};

export function RateSessionModal({
    visible,
    routineTitle,
    onDismiss,
    effort,
    onEffortChange,
    note,
    onNoteChange,
    onSubmit,
    saving,
}: Props) {
    const hint =
        effort === null ? 'Del 1 (muy ligero) al 5 (máximo esfuerzo)' : effortLabel(effort);

    return (
        <Portal>
            <Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={styles.modal}>
                <Text variant="titleMedium" style={styles.title}>
                    ¿Qué tan pesada te pareció?
                </Text>
                <Text variant="bodySmall" style={styles.subtitle}>
                    {routineTitle}
                </Text>

                <SegmentedButtons
                    value={effort === null ? '' : String(effort)}
                    onValueChange={(value) => onEffortChange(Number(value))}
                    buttons={EFFORT_LEVELS.map((level) => ({
                        value: String(level.value),
                        label: String(level.value),
                    }))}
                    style={styles.selector}
                />
                <Text variant="bodyMedium" style={styles.hint}>
                    {hint}
                </Text>

                <TextInput
                    label="Nota para tu instructor (opcional)"
                    value={note}
                    onChangeText={onNoteChange}
                    multiline
                    style={styles.input}
                />

                <Button mode="contained" onPress={onSubmit} loading={saving} disabled={saving}>
                    Enviar calificación
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
        marginBottom: 4,
    },
    subtitle: {
        color: '#666',
        marginBottom: 16,
    },
    selector: {
        marginBottom: 8,
    },
    hint: {
        textAlign: 'center',
        color: '#666',
        marginBottom: 16,
    },
    input: {
        marginBottom: 16,
    },
});