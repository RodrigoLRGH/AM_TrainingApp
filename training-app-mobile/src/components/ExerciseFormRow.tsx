import { View, StyleSheet } from 'react-native';
import { TextInput, IconButton } from 'react-native-paper';
import type { ExerciseDraft } from '../features/routines/useTemplates';

type Props = {
    exercise: ExerciseDraft;
    onChange: (field: keyof ExerciseDraft, value: string) => void;
    onRemove: () => void;
};

export function ExerciseFormRow({ exercise, onChange, onRemove }: Props) {
    return (
        <View style={styles.row}>
            <TextInput
                label="Nombre"
                value={exercise.name}
                onChangeText={(v) => onChange('name', v)}
                style={styles.name}
            />
            <TextInput
                label="Series"
                value={exercise.sets}
                onChangeText={(v) => onChange('sets', v)}
                keyboardType="numeric"
                style={styles.number}
            />
            <TextInput
                label="Reps"
                value={exercise.reps}
                onChangeText={(v) => onChange('reps', v)}
                keyboardType="numeric"
                style={styles.number}
            />
            <IconButton icon="close" onPress={onRemove} />
        </View>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    name: {
        flex: 2,
        marginRight: 4,
    },
    number: {
        flex: 1,
        marginRight: 4,
    },
});