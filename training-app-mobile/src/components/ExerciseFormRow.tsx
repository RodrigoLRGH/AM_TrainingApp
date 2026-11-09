import { View, StyleSheet } from 'react-native';
import { TextInput, IconButton, HelperText } from 'react-native-paper';
import type {
    ExerciseDraft,
    ExerciseErrors,
    ExerciseField,
} from '../features/routines/useExerciseDrafts';

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
                    onChangeText={(value) => onChange('name', value)}
                    onBlur={() => onBlur('name')}
                    error={!!errors.name}
                    style={styles.name}
                />
                <TextInput
                    mode="outlined"
                    label="Series"
                    value={exercise.sets}
                    onChangeText={(value) => onChange('sets', value)}
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
        alignItems: 'center',
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
