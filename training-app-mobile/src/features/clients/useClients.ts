import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { getClients, createClient } from '../../api/clients';

export type Client = {
    id: string;
    name: string;
    clientCode: string;
    active: boolean;
};

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
            console.error(error);
        } finally {
            setSaving(false);
        }
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
    };
}