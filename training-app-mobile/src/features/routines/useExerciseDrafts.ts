import { useCallback, useState } from 'react';
import type { NewExercise } from '../../api/types';

export type ExerciseField = 'name' | 'sets' | 'reps';
export type ExerciseDraft = { id: string } & Record<ExerciseField, string>;
export type ExerciseErrors = Partial<Record<ExerciseField, string>>;

type ExerciseSource = { name: string; sets: number; reps: number };

const MAX_COUNT = 999;
const INTEGER = /^\d+$/;
const FIELDS: ExerciseField[] = ['name', 'sets', 'reps'];

let sequence = 0;

export function emptyExercise(): ExerciseDraft {
    sequence += 1;
    return { id: `exercise-${sequence}`, name: '', sets: '', reps: '' };
}

export function toDrafts(list: ExerciseSource[]): ExerciseDraft[] {
    if (list.length === 0) {
        return [emptyExercise()];
    }
    return list.map((exercise) => ({
        ...emptyExercise(),
        name: exercise.name,
        sets: String(exercise.sets),
        reps: String(exercise.reps),
    }));
}

function isBlank(draft: ExerciseDraft) {
    return FIELDS.every((field) => draft[field].trim() === '');
}

function countError(value: string) {
    const trimmed = value.trim();
    if (trimmed === '') {
        return 'Requerido';
    }
    if (!INTEGER.test(trimmed) || Number(trimmed) < 1) {
        return 'Mínimo 1';
    }
    if (Number(trimmed) > MAX_COUNT) {
        return `Máximo ${MAX_COUNT}`;
    }
    return undefined;
}

// Una fila vacía se ignora; una fila con datos debe estar completa y ser válida.
export function validateExercise(draft: ExerciseDraft): ExerciseErrors {
    if (isBlank(draft)) {
        return {};
    }

    const errors: ExerciseErrors = {};
    const name = draft.name.trim();
    if (name === '') {
        errors.name = 'Escribe el nombre';
    } else if (name.length < 2) {
        errors.name = 'Mínimo 2 caracteres';
    }

    const sets = countError(draft.sets);
    if (sets) {
        errors.sets = sets;
    }
    const reps = countError(draft.reps);
    if (reps) {
        errors.reps = reps;
    }
    return errors;
}

/**
 * Lista editable de ejercicios con validación en tiempo real: el error de cada
 * campo aparece en cuanto el usuario sale de él y se actualiza mientras escribe.
 */
export function useExerciseDrafts(initial?: ExerciseSource[]) {
    const [exercises, setExercises] = useState<ExerciseDraft[]>(() =>
        initial ? toDrafts(initial) : [emptyExercise()],
    );
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [submitted, setSubmitted] = useState(false);

    const reset = useCallback((list: ExerciseSource[]) => {
        setExercises(toDrafts(list));
        setTouched({});
        setSubmitted(false);
    }, []);

    function addExercise() {
        setExercises((prev) => [...prev, emptyExercise()]);
    }

    function updateExercise(id: string, field: ExerciseField, value: string) {
        setExercises((prev) =>
            prev.map((exercise) => (exercise.id === id ? { ...exercise, [field]: value } : exercise)),
        );
    }

    function removeExercise(id: string) {
        setExercises((prev) => {
            const next = prev.filter((exercise) => exercise.id !== id);
            return next.length > 0 ? next : [emptyExercise()];
        });
    }

    function markTouched(id: string, field: ExerciseField) {
        setTouched((prev) => ({ ...prev, [`${id}.${field}`]: true }));
    }

    function errorsFor(draft: ExerciseDraft): ExerciseErrors {
        const all = validateExercise(draft);
        const visible: ExerciseErrors = {};
        for (const field of FIELDS) {
            if (all[field] && (submitted || touched[`${draft.id}.${field}`])) {
                visible[field] = all[field];
            }
        }
        return visible;
    }

    const filled = exercises.filter((exercise) => !isBlank(exercise));
    const emptyListError = filled.length === 0 ? 'Agrega al menos un ejercicio.' : undefined;

    /** Marca el formulario como enviado y regresa los ejercicios, o null si hay errores. */
    function build(): NewExercise[] | null {
        setSubmitted(true);
        const invalid = filled.some((exercise) => Object.keys(validateExercise(exercise)).length > 0);
        if (emptyListError || invalid) {
            return null;
        }
        return filled.map((exercise) => ({
            name: exercise.name.trim(),
            sets: Number(exercise.sets.trim()),
            reps: Number(exercise.reps.trim()),
        }));
    }

    return {
        exercises,
        addExercise,
        updateExercise,
        removeExercise,
        markTouched,
        errorsFor,
        listError: submitted ? emptyListError : undefined,
        reset,
        build,
    };
}

export type ExerciseDraftsApi = ReturnType<typeof useExerciseDrafts>;
