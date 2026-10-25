import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import type { NewExercise, Template } from '../../api/types';

export type ExerciseDraft = { name: string; sets: string; reps: string };
export type TemplatePayload = { title: string; exercises: NewExercise[] };

function emptyExercise(): ExerciseDraft {
    return { name: '', sets: '', reps: '' };
}

function toPositiveInt(value: string) {
    return Math.max(1, Number.parseInt(value, 10) || 1);
}

export function useTemplateDraft() {
    const [title, setTitle] = useState('');
    const [exercises, setExercises] = useState<ExerciseDraft[]>([emptyExercise()]);

    const fill = useCallback((template: Template) => {
        setTitle(template.title);
        setExercises(
            template.exercises.length > 0
                ? template.exercises.map((exercise) => ({
                    name: exercise.name,
                    sets: String(exercise.sets),
                    reps: String(exercise.reps),
                }))
                : [emptyExercise()],
        );
    }, []);

    function addExercise() {
        setExercises((prev) => [...prev, emptyExercise()]);
    }

    function updateExercise(index: number, field: keyof ExerciseDraft, value: string) {
        setExercises((prev) =>
            prev.map((exercise, i) => (i === index ? { ...exercise, [field]: value } : exercise)),
        );
    }

    function removeExercise(index: number) {
        setExercises((prev) => prev.filter((_, i) => i !== index));
    }

    function buildPayload(): TemplatePayload | null {
        const trimmedTitle = title.trim();
        if (trimmedTitle.length < 2) {
            Alert.alert('El título debe tener al menos 2 caracteres.');
            return null;
        }

        const filled = exercises.filter((exercise) => exercise.name.trim() !== '');
        if (filled.length === 0) {
            Alert.alert('Agrega al menos un ejercicio.');
            return null;
        }
        if (filled.some((exercise) => exercise.name.trim().length < 2)) {
            Alert.alert('El nombre de cada ejercicio debe tener al menos 2 caracteres.');
            return null;
        }

        return {
            title: trimmedTitle,
            exercises: filled.map((exercise) => ({
                name: exercise.name.trim(),
                sets: toPositiveInt(exercise.sets),
                reps: toPositiveInt(exercise.reps),
            })),
        };
    }

    return {
        title,
        setTitle,
        exercises,
        fill,
        addExercise,
        updateExercise,
        removeExercise,
        buildPayload,
    };
}