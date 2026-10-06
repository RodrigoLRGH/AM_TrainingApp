import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { getRoutines, createRoutine } from '../../api/routines';

export type ExerciseDraft = { name: string; sets: string; reps: string };
export type Template = {
    id: string;
    title: string;
    exercises: { id: string; name: string; sets: number; reps: number }[];
};

export function useTemplates() {
    const [templates, setTemplates] = useState<Template[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [title, setTitle] = useState('');
    const [exercises, setExercises] = useState<ExerciseDraft[]>([
        { name: '', sets: '', reps: '' },
    ]);
    const [saving, setSaving] = useState(false);

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getRoutines(true);
            setTemplates(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            load();
        }, [load]),
    );

    function addExerciseField() {
        setExercises((prev) => [...prev, { name: '', sets: '', reps: '' }]);
    }

    function updateExercise(index: number, field: keyof ExerciseDraft, value: string) {
        setExercises((prev) =>
            prev.map((ex, i) => (i === index ? { ...ex, [field]: value } : ex)),
        );
    }

    function removeExercise(index: number) {
        setExercises((prev) => prev.filter((_, i) => i !== index));
    }

    function resetForm() {
        setTitle('');
        setExercises([{ name: '', sets: '', reps: '' }]);
    }

    async function handleCreate() {
        const validExercises = exercises
            .filter((ex) => ex.name.trim())
            .map((ex) => ({
                name: ex.name.trim(),
                sets: Number(ex.sets) || 1,
                reps: Number(ex.reps) || 1,
            }));

        if (!title.trim() || validExercises.length === 0) return;

        setSaving(true);
        try {
            await createRoutine({ title: title.trim(), isTemplate: true, exercises: validExercises });
            resetForm();
            setModalVisible(false);
            load();
        } catch (error) {
            console.error(error);
        } finally {
            setSaving(false);
        }
    }

    return {
        templates,
        loading,
        modalVisible,
        setModalVisible,
        title,
        setTitle,
        exercises,
        addExerciseField,
        updateExercise,
        removeExercise,
        saving,
        handleCreate,
    };
}