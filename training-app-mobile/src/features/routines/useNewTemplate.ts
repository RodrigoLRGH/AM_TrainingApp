import { useState } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { createTemplate } from '../../api/routines';
import { getErrorMessage } from '../../api/errors';
import { useTemplateDraft } from './useTemplateDraft';

export function useNewTemplate() {
    const router = useRouter();
    const draft = useTemplateDraft();
    const [saving, setSaving] = useState(false);

    async function submit() {
        const payload = draft.buildPayload();
        if (!payload) {
            return;
        }

        setSaving(true);
        try {
            await createTemplate(payload);
            router.back();
        } catch (error) {
            Alert.alert(getErrorMessage(error, 'No se pudo guardar la plantilla.'));
        } finally {
            setSaving(false);
        }
    }

    return {
        title: draft.title,
        setTitle: draft.setTitle,
        exercises: draft.exercises,
        addExercise: draft.addExercise,
        updateExercise: draft.updateExercise,
        removeExercise: draft.removeExercise,
        saving,
        submit,
    };
}