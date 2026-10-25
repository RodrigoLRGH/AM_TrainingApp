import { useState } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { createTemplate } from '../../api/routines';
import { getErrorMessage } from '../../api/errors';

export type ExerciseDraft = { name: string; sets: string; reps: string };

function emptyExercise(): ExerciseDraft {
    return { name: '', sets: '', reps: '' };
}

function toPositiveInt(value: string) {
    return Math.max(1, Number.parseInt(value, 10) || 1);
}

export function useNewTemplate() {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [exercises, setExercises] = useState<ExerciseDraft[]>([emptyExercise()]);
    const [saving, setSaving] = useState(false);

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

    async function submit() {
        const trimmedTitle = title.trim();
        if (trimmedTitle.length < 2) {
            Alert.alert('El título debe tener al menos 2 caracteres.');
            return;
        }

        const filled = exercises.filter((exercise) => exercise.name.trim() !== '');
        if (filled.length === 0) {
            Alert.alert('Agrega al menos un ejercicio.');
            return;
        }
        if (filled.some((exercise) => exercise.name.trim().length < 2)) {
            Alert.alert('El nombre de cada ejercicio debe tener al menos 2 caracteres.');
            return;
        }

        setSaving(true);
        try {
            await createTemplate({
                title: trimmedTitle,
                exercises: filled.map((exercise) => ({
                    name: exercise.name.trim(),
                    sets: toPositiveInt(exercise.sets),
                    reps: toPositiveInt(exercise.reps),
                })),
            });
            router.back();
        } catch (error) {
            Alert.alert(getErrorMessage(error, 'No se pudo guardar la plantilla.'));
        } finally {
            setSaving(false);
        }
    }

    return {
        title,
        setTitle,
        exercises,
        addExercise,
        updateExercise,
        removeExercise,
        saving,
        submit,
    };
}