import { Button, HelperText } from 'react-native-paper';
import type { ExerciseDraftsApi } from '../features/routines/useExerciseDrafts';
import { ExerciseFormRow } from './ExerciseFormRow';
import { LIMITS } from '../features/forms/limits';

type Props = {
    drafts: ExerciseDraftsApi;
};

export function ExerciseListEditor({ drafts }: Props) {
    return (
        <>
            {drafts.exercises.map((exercise) => (
                <ExerciseFormRow
                    key={exercise.id}
                    exercise={exercise}
                    errors={drafts.errorsFor(exercise)}
                    onChange={(field, value) => drafts.updateExercise(exercise.id, field, value)}
                    onBlur={(field) => drafts.markTouched(exercise.id, field)}
                    onRemove={() => drafts.removeExercise(exercise.id)}
                />
            ))}
            {drafts.listError ? <HelperText type="error">{drafts.listError}</HelperText> : null}
            <Button icon="plus" onPress={drafts.addExercise} disabled={!drafts.canAddExercise}>
                {drafts.canAddExercise
                    ? 'Agregar ejercicio'
                    : `Máximo ${LIMITS.exercisesPerRoutine} ejercicios`}
            </Button>
        </>
    );
}
