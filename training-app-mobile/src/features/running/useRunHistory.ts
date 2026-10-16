import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { getRuns, getRun } from '../../api/running';
import { getErrorMessage } from '../../api/errors';
import type { RunSession } from '../../api/types';

export function useRunHistory() {
    const [runs, setRuns] = useState<RunSession[]>([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState<RunSession | null>(null);

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getRuns();
            setRuns(data.filter((run) => run.endedAt !== null));
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

    async function openRun(id: string) {
        try {
            const run = await getRun(id);
            setSelected(run);
        } catch (error) {
            Alert.alert(getErrorMessage(error, 'No se pudo cargar la corrida.'));
        }
    }

    function closeRun() {
        setSelected(null);
    }

    return { runs, loading, selected, openRun, closeRun };
}