import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { getTemplates, updateTemplate } from '../../api/routines';
import { getErrorMessage } from '../../api/errors';
import { useTemplateDraft } from './useTemplateDraft';

export function useEditTemplate(templateId: string) {
    const router = useRouter();
    const draft = useTemplateDraft();
    const { fill } = draft;
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        let cancelled = false;

        async function load() {
            try {
                const templates = await getTemplates();
                const found = templates.find((template) => template.id === templateId);
                if (cancelled) {
                    return;
                }
                if (found) {
                    fill(found);
                } else {
                    setNotFound(true);
                }
            } catch (error) {
                if (!cancelled) {
                    Alert.alert(getErrorMessage(error, 'No se pudo cargar la plantilla.'));
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        load();

        return () => {
            cancelled = true;
        };
    }, [templateId, fill]);

    async function submit() {
        const payload = draft.buildPayload();
        if (!payload) {
            return;
        }

        setSaving(true);
        try {
            await updateTemplate(templateId, payload);
            router.back();
        } catch (error) {
            Alert.alert(getErrorMessage(error, 'No se pudieron guardar los cambios.'));
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
        loading,
        notFound,
        saving,
        submit,
    };
}