import { useEffect, useState } from 'react';
import { AppAlert } from '../../components/AppAlert';
import { useRouter } from 'expo-router';
import { getClients } from '../../api/clients';
import { assignTemplate, getTemplates } from '../../api/routines';
import { getErrorMessage } from '../../api/errors';
import type { Client, NewExercise } from '../../api/types';
import { startOfToday, toNoonIso } from '../../utils/format';

export function useAssignTemplate(templateId: string) {
    const router = useRouter();
    const [clients, setClients] = useState<Client[]>([]);
    const [templateExercises, setTemplateExercises] = useState<NewExercise[]>([]);
    const [loadingClients, setLoadingClients] = useState(true);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    // RF-26: ejercicios ajustados por cliente; si no hay ajuste se usa la plantilla tal cual.
    const [overrides, setOverrides] = useState<Record<string, NewExercise[]>>({});
    const [adjustingId, setAdjustingId] = useState<string | null>(null);
    const [minimumDate] = useState(() => startOfToday());
    const [date, setDate] = useState(() => new Date());
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        let cancelled = false;

        async function load() {
            try {
                const [clientList, templates] = await Promise.all([getClients(), getTemplates()]);
                if (cancelled) {
                    return;
                }
                setClients(clientList.filter((client) => client.active));
                const template = templates.find((item) => item.id === templateId);
                setTemplateExercises(
                    (template?.exercises ?? []).map(({ name, sets, reps }) => ({ name, sets, reps })),
                );
            } catch (error) {
                if (!cancelled) {
                    AppAlert.alert(getErrorMessage(error, 'No se pudieron cargar tus clientes.'));
                }
            } finally {
                if (!cancelled) {
                    setLoadingClients(false);
                }
            }
        }

        load();

        return () => {
            cancelled = true;
        };
    }, [templateId]);

    function toggleClient(id: string) {
        if (selectedIds.includes(id)) {
            setSelectedIds((prev) => prev.filter((clientId) => clientId !== id));
            setOverrides(({ [id]: _removed, ...rest }) => rest);
        } else {
            setSelectedIds((prev) => [...prev, id]);
        }
    }

    function saveOverride(exercises: NewExercise[]) {
        if (adjustingId) {
            setOverrides((prev) => ({ ...prev, [adjustingId]: exercises }));
        }
        setAdjustingId(null);
    }

    function restoreTemplate() {
        if (adjustingId) {
            setOverrides(({ [adjustingId]: _removed, ...rest }) => rest);
        }
        setAdjustingId(null);
    }

    async function submit() {
        if (selectedIds.length === 0) {
            AppAlert.alert('Selecciona al menos un cliente.');
            return;
        }

        setSaving(true);
        try {
            await assignTemplate(templateId, {
                clientIds: selectedIds,
                date: toNoonIso(date),
                overrides: selectedIds
                    .filter((clientId) => overrides[clientId])
                    .map((clientId) => ({ clientId, exercises: overrides[clientId] })),
            });
            AppAlert.alert('Rutina asignada', undefined, [
                { text: 'Listo', onPress: () => router.back() },
            ]);
        } catch (error) {
            AppAlert.alert(getErrorMessage(error, 'No se pudo asignar la rutina.'));
        } finally {
            setSaving(false);
        }
    }

    const adjustingClient = clients.find((client) => client.id === adjustingId) ?? null;

    return {
        clients,
        loadingClients,
        selectedIds,
        toggleClient,
        overrides,
        templateExercises,
        adjustingClient,
        startAdjusting: setAdjustingId,
        stopAdjusting: () => setAdjustingId(null),
        saveOverride,
        restoreTemplate,
        date,
        setDate,
        minimumDate,
        saving,
        submit,
    };
}

export type AssignTemplateApi = ReturnType<typeof useAssignTemplate>;
