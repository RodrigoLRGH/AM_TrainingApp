import { useCallback, useState } from 'react';
import { AppAlert } from '../../components/AppAlert';
import { useFocusEffect } from 'expo-router';
import { getClients, createClient, setClientActive } from '../../api/clients';
import { getErrorMessage } from '../../api/errors';
import type { Client } from '../../api/types';
import { useForm } from '../forms/useForm';
import { compose, minLength, required } from '../forms/rules';

export function useClients() {
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const newClientForm = useForm(
        { name: '' },
        {
            name: compose(
                required('Escribe el nombre del cliente.'),
                minLength(2, 'El nombre debe tener al menos 2 caracteres.'),
            ),
        },
    );
    const [saving, setSaving] = useState(false);

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getClients();
            setClients(data);
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

    function openModal() {
        newClientForm.reset();
        setModalVisible(true);
    }

    async function handleCreate() {
        if (!newClientForm.validate()) return;
        setSaving(true);
        try {
            await createClient(newClientForm.values.name.trim());
            setModalVisible(false);
            newClientForm.reset();
            load();
        } catch (error) {
            AppAlert.alert(getErrorMessage(error, 'No se pudo crear el cliente.'));
        } finally {
            setSaving(false);
        }
    }

    async function applyActive(client: Client, active: boolean) {
        try {
            await setClientActive(client.id, active);
            setClients((prev) =>
                prev.map((item) => (item.id === client.id ? { ...item, active } : item)),
            );
        } catch (error) {
            AppAlert.alert(getErrorMessage(error, 'No se pudo actualizar al cliente.'));
        }
    }

    function confirmToggle(client: Client) {
        if (!client.active) {
            applyActive(client, true);
            return;
        }

        AppAlert.alert(
            'Desactivar cliente',
            `${client.name} no podrá iniciar sesión ni recibirá avisos. Sus datos se conservan y puedes activarlo cuando quieras.`,
            [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Desactivar', style: 'destructive', onPress: () => applyActive(client, false) },
            ],
        );
    }

    return {
        clients,
        loading,
        modalVisible,
        setModalVisible,
        openModal,
        newClientForm,
        saving,
        handleCreate,
        confirmToggle,
    };
}