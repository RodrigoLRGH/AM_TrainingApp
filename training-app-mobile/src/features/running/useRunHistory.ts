import { useCallback, useState } from 'react';
import { AppAlert } from '../../components/AppAlert';
import { useFocusEffect } from 'expo-router';
import { getRuns, getRun } from '../../api/running';
import { getErrorMessage, loadErrorMessage } from '../../api/errors';
import type { RunSession } from '../../api/types';

export function useRunHistory() {
    const [runs, setRuns] = useState<RunSession[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);
    const [selected, setSelected] = useState<RunSession | null>(null);

    const load = useCallback(async () => {
        setLoading(true);
        setLoadError(null);
        try {
            const data = await getRuns();
            setRuns(data.filter((run) => run.endedAt !== null));
        } catch (error) {
            setLoadError(loadErrorMessage(error, 'No se pudieron cargar tus corridas.'));
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
            AppAlert.alert(getErrorMessage(error, 'No se pudo cargar la corrida.'));
        }
    }

    function closeRun() {
        setSelected(null);
    }

    return { runs, loading, loadError, reload: load, selected, openRun, closeRun };
}