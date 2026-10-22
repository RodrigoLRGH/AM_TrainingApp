import { useState } from 'react';
import { Alert } from 'react-native';
import { createSessionRating } from '../../api/ratings';
import { getErrorMessage } from '../../api/errors';
import type { NewSessionRating, Routine } from '../../api/types';

export function useRateSession() {
    const [routine, setRoutine] = useState<Routine | null>(null);
    const [effort, setEffort] = useState<number | null>(null);
    const [note, setNote] = useState('');
    const [saving, setSaving] = useState(false);
    const [ratedIds, setRatedIds] = useState<string[]>([]);

    function open(selected: Routine) {
        setRoutine(selected);
        setEffort(null);
        setNote('');
    }

    function close() {
        setRoutine(null);
    }

    async function submit() {
        if (!routine) {
            return;
        }

        if (effort === null) {
            Alert.alert('Elige qué tan pesada te pareció la sesión.');
            return;
        }

        const payload: NewSessionRating = { effort, routineId: routine.id };
        const trimmed = note.trim();
        if (trimmed) {
            payload.note = trimmed;
        }

        setSaving(true);
        try {
            await createSessionRating(payload);
            setRatedIds((prev) => [...prev, routine.id]);
            close();
            Alert.alert('Gracias, tu instructor verá tu calificación.');
        } catch (error) {
            Alert.alert(getErrorMessage(error, 'No se pudo guardar la calificación.'));
        } finally {
            setSaving(false);
        }
    }

    return {
        routine,
        effort,
        setEffort,
        note,
        setNote,
        saving,
        ratedIds,
        open,
        close,
        submit,
    };
}