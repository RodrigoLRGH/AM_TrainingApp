import { useState } from 'react';
import { AppAlert } from '../../components/AppAlert';
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
            AppAlert.alert(getErrorMessage(error, 'No se pudo guardar la plantilla.'));
        } finally {
            setSaving(false);
        }
    }

    return { draft, saving, submit };
}
