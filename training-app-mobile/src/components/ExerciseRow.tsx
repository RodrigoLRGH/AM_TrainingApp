import type { Exercise } from '../api/types';
import { SelectRow } from './SelectRow';

type Props = {
    exercise: Exercise;
    completed: boolean;
    onToggle: (id: string) => void;
};

export function ExerciseRow({ exercise, completed, onToggle }: Props) {
    return (
        <SelectRow
            title={exercise.name}
            subtitle={`${exercise.sets} series x ${exercise.reps} repeticiones`}
            selected={completed}
            strikeWhenSelected
            onPress={() => onToggle(exercise.id)}
        />
    );
}