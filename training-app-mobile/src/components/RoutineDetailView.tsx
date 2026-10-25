import { ScrollView, View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';
import type { Routine } from '../api/types';
import { RoutineSummaryCard } from './RoutineSummaryCard';
import { ExerciseRow } from './ExerciseRow';

const GREEN = '#2e5d31';

type Props = {
    routine: Routine;
    onToggleExercise: (id: string) => void;
    rated: boolean;
    onRate: () => void;
};

export function RoutineDetailView({ routine, onToggleExercise, rated, onRate }: Props) {
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <RoutineSummaryCard routine={routine} />

            {routine.exercises.map((exercise) => (
                <ExerciseRow
                    key={exercise.id}
                    exercise={exercise}
                    completed={exercise.completed}
                    onToggle={onToggleExercise}
                />
            ))}

            <Button mode="contained" onPress={onRate} disabled={rated} style={styles.rateButton}>
                {rated ? 'Sesión calificada' : 'Calificar sesión'}
            </Button>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        paddingBottom: 32,
    },
    header: {
        borderLeftWidth: 4,
        borderLeftColor: GREEN,
        paddingLeft: 12,
        marginTop: 8,
        marginBottom: 16,
    },
    heading: {
        fontWeight: 'bold',
        color: GREEN,
    },
    subheading: {
        color: '#444',
    },
    rateButton: {
        marginTop: 12,
    },
});