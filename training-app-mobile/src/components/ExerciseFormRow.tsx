import { View, StyleSheet } from 'react-native';
import { TextInput, IconButton, HelperText } from 'react-native-paper';
import type {
    ExerciseDraft,
    ExerciseErrors,
    ExerciseField,
} from '../features/routines/useExerciseDrafts';
import { LIMITS } from '../features/forms/limits';

type Props = {
    exercise: ExerciseDraft;
    errors: ExerciseErrors;
    onChange: (field: ExerciseField, value: string) => void;
    onBlur: (field: ExerciseField) => void;
    onRemove: () => void;
};

const LABELS: Record<ExerciseField, string> = {
    name: 'Nombre',
    sets: 'Series',
    reps: 'Reps',
};

export function ExerciseFormRow({ exercise, errors, onChange, onBlur, onRemove }: Props) {
    const messages = (Object.keys(LABELS) as ExerciseField[])
        .filter((field) => errors[field])
        .map((field) => `${LABELS[field]}: ${errors[field]}`);

    return (
        <View style={styles.container}>
            <View style={styles.row}>
                <TextInput
                    mode="outlined"
                    label="Nombre"
                    value={exercise.name}
                    // Multilínea para que los nombres largos crezcan hacia abajo en lugar de
                    // salirse del borde; Enter cierra el teclado y no se permiten saltos de línea.
                    multiline
                    submitBehavior="blurAndSubmit"
                    returnKeyType="done"
                    maxLength={LIMITS.exerciseName}
                    onChangeText={(value) => onChange('name', value.replace(/\s*\n+\s*/g, ' '))}
                    onBlur={() => onBlur('name')}
                    error={!!errors.name}
                    style={styles.name}
                />
                <TextInput
                    mode="outlined"
                    label="Series"
                    value={exercise.sets}
                    onChangeText={(value) => onChange('sets', value)}
                    maxLength={String(LIMITS.sets).length}
                    onBlur={() => onBlur('sets')}
                    error={!!errors.sets}
                    keyboardType="number-pad"
                    style={styles.number}
                />
                <TextInput
                    mode="outlined"
                    label="Reps"
                    value={exercise.reps}
                    onChangeText={(value) => onChange('reps', value)}
                    maxLength={String(LIMITS.reps).length}
                    onBlur={() => onBlur('reps')}
                    error={!!errors.reps}
                    keyboardType="number-pad"
                    style={styles.number}
                />
                <IconButton icon="close" onPress={onRemove} accessibilityLabel="Quitar ejercicio" />
            </View>
            {messages.length > 0 ? (
                <HelperText type="error" style={styles.helper}>
                    {messages.join(' · ')}
                </HelperText>
            ) : null}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 8,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    name: {
        flex: 2,
        marginRight: 4,
    },
    number: {
        flex: 1,
        marginRight: 4,
    },
    helper: {
        paddingHorizontal: 0,
    },
});
