import { useEffect, useState } from 'react';
import { AppAlert } from '../../components/AppAlert';
import { useRouter } from 'expo-router';
import {
    getClientRoutines,
    getTemplates,
    updateRoutine,
    updateTemplate,
} from '../../api/routines';
import { getErrorMessage } from '../../api/errors';
import { toNoonIso } from '../../utils/format';
import { useTemplateDraft } from './useTemplateDraft';

/**
 * Edita una plantilla o, si se pasa clientId, una rutina ya asignada a ese
 * cliente (RF-05). Las rutinas asignadas también permiten cambiar la fecha.
 */
export function useEditTemplate(routineId: string, clientId?: string) {
    const router = useRouter();
    const draft = useTemplateDraft();
    const { fill } = draft;
    const isAssigned = Boolean(clientId);
    const [date, setDate] = useState(() => new Date());
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        let cancelled = false;

        async function load() {
            try {
                const found = clientId
                    ? (await getClientRoutines(clientId)).find((item) => item.id === routineId)
                    : (await getTemplates()).find((item) => item.id === routineId);
                if (cancelled) {
                    return;
                }
                if (!found) {
                    setNotFound(true);
                    return;
                }
                fill(found);
                if ('date' in found && typeof found.date === 'string') {
                    setDate(new Date(found.date));
                }
            } catch (error) {
                if (!cancelled) {
                    AppAlert.alert(getErrorMessage(error, 'No se pudo cargar la rutina.'));
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
    }, [routineId, clientId, fill]);

    async function submit() {
        const payload = draft.buildPayload();
        if (!payload) {
            return;
        }

        setSaving(true);
        try {
            if (isAssigned) {
                await updateRoutine(routineId, { ...payload, date: toNoonIso(date) });
            } else {
                await updateTemplate(routineId, payload);
            }
            router.back();
        } catch (error) {
            AppAlert.alert(getErrorMessage(error, 'No se pudieron guardar los cambios.'));
        } finally {
            setSaving(false);
        }
    }

    return { draft, isAssigned, date, setDate, loading, notFound, saving, submit };
}
