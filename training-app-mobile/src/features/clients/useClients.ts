import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { getClients, createClient, setClientActive } from '../../api/clients';
import { getErrorMessage } from '../../api/errors';
import type { Client } from '../../api/types';

export function useClients() {
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [newName, setNewName] = useState('');
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

    async function handleCreate() {
        if (!newName.trim()) return;
        setSaving(true);
        try {
            await createClient(newName.trim());
            setNewName('');
            setModalVisible(false);
            load();
        } catch (error) {
            Alert.alert(getErrorMessage(error, 'No se pudo crear el cliente.'));
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
            Alert.alert(getErrorMessage(error, 'No se pudo actualizar al cliente.'));
        }
    }

    function confirmToggle(client: Client) {
        if (!client.active) {
            applyActive(client, true);
            return;
        }

        Alert.alert(
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
        newName,
        setNewName,
        saving,
        handleCreate,
        confirmToggle,
    };
}