import { StyleSheet } from 'react-native';
import { Card, Button } from 'react-native-paper';
import type { Routine } from '../api/types';
import { ExerciseRow } from './ExerciseRow';

type Props = {
    routine: Routine;
    completed: Record<string, boolean>;
    onToggleExercise: (id: string) => void;
    rated: boolean;
    onRate: (routine: Routine) => void;
};

export function RoutineCard({ routine, completed, onToggleExercise, rated, onRate }: Props) {
    return (
        <Card style={styles.card}>
            <Card.Title title={routine.title} subtitle={new Date(routine.date).toLocaleDateString()} />
            <Card.Content>
                {routine.exercises.map((ex) => (
                    <ExerciseRow
                        key={ex.id}
                        exercise={ex}
                        completed={!!completed[ex.id]}
                        onToggle={onToggleExercise}
                    />
                ))}
            </Card.Content>
            <Card.Actions>
                <Button mode="outlined" onPress={() => onRate(routine)} disabled={rated}>
                    {rated ? 'Sesión calificada' : 'Calificar sesión'}
                </Button>
            </Card.Actions>
        </Card>
    );
}

const styles = StyleSheet.create({
    card: {
        marginBottom: 16,
    },
});