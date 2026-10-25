import { ScrollView, StyleSheet } from 'react-native';
import { Text, TextInput, Button } from 'react-native-paper';
import type { ExerciseDraft } from '../features/routines/useTemplateDraft';
import { ExerciseFormRow } from './ExerciseFormRow';

type Props = {
    title: string;
    onTitleChange: (value: string) => void;
    exercises: ExerciseDraft[];
    onExerciseChange: (index: number, field: keyof ExerciseDraft, value: string) => void;
    onExerciseRemove: (index: number) => void;
    onAddExercise: () => void;
    onSubmit: () => void;
    saving: boolean;
    submitLabel?: string;
};

export function TemplateForm({
    title,
    onTitleChange,
    exercises,
    onExerciseChange,
    onExerciseRemove,
    onAddExercise,
    onSubmit,
    saving,
    submitLabel = "Guardar plantilla",
}: Props) {
    return (
        <ScrollView
            contentContainerStyle={styles.container}
            contentInsetAdjustmentBehavior="automatic"
            keyboardShouldPersistTaps="handled"
            automaticallyAdjustKeyboardInsets
        >
            <TextInput
                label="Título de la rutina"
                value={title}
                onChangeText={onTitleChange}
                style={styles.input}
            />

            <Text variant="labelLarge" style={styles.sectionLabel}>
                Ejercicios
            </Text>
            {exercises.map((exercise, index) => (
                <ExerciseFormRow
                    key={index}
                    exercise={exercise}
                    onChange={(field, value) => onExerciseChange(index, field, value)}
                    onRemove={() => onExerciseRemove(index)}
                />
            ))}

            <Button onPress={onAddExercise} style={styles.addButton}>
                + Agregar ejercicio
            </Button>

            <Button mode="contained" onPress={onSubmit} loading={saving} disabled={saving}>
                {submitLabel}
            </Button>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        paddingBottom: 32,
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