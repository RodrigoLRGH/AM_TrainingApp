import { useState } from 'react';
import { AppAlert } from '../../components/AppAlert';
import { createSessionRating } from '../../api/ratings';
import { getErrorMessage } from '../../api/errors';
import type { NewSessionRating } from '../../api/types';

export function useRateSession(routineId: string, alreadyRated: boolean) {
    const [visible, setVisible] = useState(false);
    const [effort, setEffort] = useState<number | null>(null);
    const [note, setNote] = useState('');
    const [saving, setSaving] = useState(false);
    const [justRated, setJustRated] = useState(false);

    function open() {
        setEffort(null);
        setNote('');
        setVisible(true);
    }

    function close() {
        setVisible(false);
    }

    async function submit() {
        if (effort === null) {
            AppAlert.alert('Elige qué tan pesada te pareció la sesión.');
            return;
        }

        const payload: NewSessionRating = { effort, routineId };
        const trimmed = note.trim();
        if (trimmed) {
            payload.note = trimmed;
        }

        setSaving(true);
        try {
            await createSessionRating(payload);
            setJustRated(true);
            close();
            AppAlert.alert('Gracias, tu instructor verá tu calificación.');
        } catch (error) {
            AppAlert.alert(getErrorMessage(error, 'No se pudo guardar la calificación.'));
        } finally {
            setSaving(false);
        }
    }

    return {
        visible,
        effort,
        setEffort,
        note,
        setNote,
        saving,
        rated: alreadyRated || justRated,
        open,
        close,
        submit,
    };
}