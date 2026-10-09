import { useState } from 'react';
import { Alert } from 'react-native';
import { getClients } from '../../api/clients';
import { assignTemplate } from '../../api/routines';
import type { Client } from '../clients/useClients';
import type { Template } from './useTemplates';

function todayString() {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${now.getFullYear()}-${month}-${day}`;
}

export function useAssignTemplate() {
    const [template, setTemplate] = useState<Template | null>(null);
    const [clients, setClients] = useState<Client[]>([]);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [date, setDate] = useState(todayString());
    const [loadingClients, setLoadingClients] = useState(false);
    const [saving, setSaving] = useState(false);

    async function open(selected: Template) {
        setTemplate(selected);
        setSelectedIds([]);
        setDate(todayString());
        setLoadingClients(true);
        try {
            const data = await getClients();
            setClients(data.filter((client: Client) => client.active));
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingClients(false);
        }
    }

    function close() {
        setTemplate(null);
    }

    function toggleClient(id: string) {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((clientId) => clientId !== id) : [...prev, id],
        );
    }

    async function submit() {
        if (!template) return;

        if (selectedIds.length === 0) {
            Alert.alert('Selecciona al menos un cliente.');
            return;
        }
        if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
            Alert.alert('La fecha debe tener formato AAAA-MM-DD.');
            return;
        }

        setSaving(true);
        try {
            await assignTemplate(template.id, {
                clientIds: selectedIds,
                date: `${date}T12:00:00`,
            });
            Alert.alert('Rutina asignada');
            close();
        } catch (error) {
            Alert.alert('No se pudo asignar la rutina.');
        } finally {
            setSaving(false);
        }
    }

    return {
        template,
        clients,
        selectedIds,
        date,
        setDate,
        loadingClients,
        saving,
        open,
        close,
        toggleClient,
        submit,
    };
}