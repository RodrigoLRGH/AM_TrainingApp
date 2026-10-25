import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { getClients } from '../../api/clients';
import { assignTemplate } from '../../api/routines';
import { getErrorMessage } from '../../api/errors';
import type { Client } from '../../api/types';
import { startOfToday, toNoonIso } from '../../utils/format';

export function useAssignTemplate(templateId: string) {
    const router = useRouter();
    const [clients, setClients] = useState<Client[]>([]);
    const [loadingClients, setLoadingClients] = useState(true);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [minimumDate] = useState(() => startOfToday());
    const [date, setDate] = useState(() => new Date());
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        let cancelled = false;

        async function load() {
            try {
                const data = await getClients();
                if (!cancelled) {
                    setClients(data.filter((client) => client.active));
                }
            } catch (error) {
                if (!cancelled) {
                    Alert.alert(getErrorMessage(error, 'No se pudieron cargar tus clientes.'));
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
    }, []);

    function toggleClient(id: string) {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((clientId) => clientId !== id) : [...prev, id],
        );
    }

    async function submit() {
        if (selectedIds.length === 0) {
            Alert.alert('Selecciona al menos un cliente.');
            return;
        }

        setSaving(true);
        try {
            await assignTemplate(templateId, {
                clientIds: selectedIds,
                date: toNoonIso(date),
            });
            Alert.alert('Rutina asignada', undefined, [
                { text: 'Listo', onPress: () => router.back() },
            ]);
        } catch (error) {
            Alert.alert(getErrorMessage(error, 'No se pudo asignar la rutina.'));
        } finally {
            setSaving(false);
        }
    }

    return {
        clients,
        loadingClients,
        selectedIds,
        toggleClient,
        date,
        setDate,
        minimumDate,
        saving,
        submit,
    };
}