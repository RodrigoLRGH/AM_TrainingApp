import { View, StyleSheet } from 'react-native';
import { Text, Checkbox } from 'react-native-paper';
import type { Exercise } from '../features/routines/useMyRoutines';

type Props = {
    exercise: Exercise;
    completed: boolean;
    onToggle: (id: string) => void;
};

export function ExerciseRow({ exercise, completed, onToggle }: Props) {
    return (
        <View style={styles.row}>
            <Checkbox
                status={completed ? 'checked' : 'unchecked'}
                onPress={() => onToggle(exercise.id)}
            />
            <View style={styles.textContainer}>
                <Text variant="bodyLarge" style={completed ? styles.done : undefined}>
                    {exercise.name}
                </Text>
                <Text variant="bodySmall">
                    {exercise.sets} series x {exercise.reps} repeticiones
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    textContainer: {
        flex: 1,
    },
    done: {
        textDecorationLine: 'line-through',
        color: '#999',
    },
});