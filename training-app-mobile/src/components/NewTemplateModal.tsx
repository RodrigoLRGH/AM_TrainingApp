import { StyleSheet } from 'react-native';
import { Text, Portal, Modal, TextInput, Button } from 'react-native-paper';
import type { ExerciseDraft } from '../features/routines/useTemplates';
import { ExerciseFormRow } from './ExerciseFormRow';

type Props = {
    visible: boolean;
    onDismiss: () => void;
    title: string;
    onTitleChange: (value: string) => void;
    exercises: ExerciseDraft[];
    onExerciseChange: (index: number, field: keyof ExerciseDraft, value: string) => void;
    onExerciseRemove: (index: number) => void;
    onAddExercise: () => void;
    onSubmit: () => void;
    saving: boolean;
};

export function NewTemplateModal({
    visible,
    onDismiss,
    title,
    onTitleChange,
    exercises,
    onExerciseChange,
    onExerciseRemove,
    onAddExercise,
    onSubmit,
    saving,
}: Props) {
    return (
        <Portal>
            <Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={styles.modal}>
                <Text variant="titleMedium" style={styles.modalTitle}>
                    Nueva plantilla
                </Text>
                <TextInput
                    label="Título de la rutina"
                    value={title}
                    onChangeText={onTitleChange}
                    style={styles.input}
                />

                <Text variant="labelLarge" style={styles.sectionLabel}>
                    Ejercicios
                </Text>
                {exercises.map((ex, index) => (
                    <ExerciseFormRow
                        key={index}
                        exercise={ex}
                        onChange={(field, value) => onExerciseChange(index, field, value)}
                        onRemove={() => onExerciseRemove(index)}
                    />
                ))}

                <Button onPress={onAddExercise} style={styles.addButton}>
                    + Agregar ejercicio
                </Button>

                <Button mode="contained" onPress={onSubmit} loading={saving} disabled={saving}>
                    Guardar plantilla
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
    modalTitle: {
        marginBottom: 16,
    },
    input: {
        marginBottom: 16,
    },
    sectionLabel: {
        marginBottom: 8,
    },
    addButton: {
        marginBottom: 16,
    },
});