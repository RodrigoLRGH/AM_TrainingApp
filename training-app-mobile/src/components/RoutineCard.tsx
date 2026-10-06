import { Card } from 'react-native-paper';
import type { Routine } from '../features/routines/useMyRoutines';
import { ExerciseRow } from './ExerciseRow';

type Props = {
    routine: Routine;
    completed: Record<string, boolean>;
    onToggleExercise: (id: string) => void;
};

export function RoutineCard({ routine, completed, onToggleExercise }: Props) {
    return (
        <Card style={{ marginBottom: 16 }}>
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
        </Card>
    );
}