import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { getTemplates } from '../../api/routines';
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

    return { templates, loading };
}