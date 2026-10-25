import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { getTemplates, deleteTemplate } from '../../api/routines';
import { getErrorMessage } from '../../api/errors';
import type { Template } from '../../api/types';

export function useTemplates() {
    const [templates, setTemplates] = useState<Template[]>([]);
    const [loading, setLoading] = useState(true);

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getTemplates();
            setTemplates(data);
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

    async function remove(templateId: string) {
        try {
            await deleteTemplate(templateId);
            setTemplates((prev) => prev.filter((template) => template.id !== templateId));
        } catch (error) {
            Alert.alert(getErrorMessage(error, 'No se pudo eliminar la plantilla.'));
        }
    }

    function confirmDelete(template: Template) {
        Alert.alert(
            'Eliminar plantilla',
            `¿Eliminar "${template.title}"? Las rutinas que ya asignaste a tus clientes no se borran.`,
            [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Eliminar', style: 'destructive', onPress: () => remove(template.id) },
            ],
        );
    }

    return { templates, loading, confirmDelete };
}