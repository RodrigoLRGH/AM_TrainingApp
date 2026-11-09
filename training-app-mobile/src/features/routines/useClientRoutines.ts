import { useCallback, useState } from 'react';
import { useFocusEffect, useRouter } from 'expo-router';
import { AppAlert } from '../../components/AppAlert';
import { deleteRoutine, getClientRoutines } from '../../api/routines';
import { getErrorMessage } from '../../api/errors';
import type { Routine } from '../../api/types';

/** Rutinas ya asignadas a un cliente, con edición y eliminación (RF-05). */
export function useClientRoutines(clientId: string) {
    const router = useRouter();
    const [routines, setRoutines] = useState<Routine[]>([]);
    const [loading, setLoading] = useState(true);

    const load = useCallback(async () => {
        setLoading(true);
        try {
            setRoutines(await getClientRoutines(clientId));
        } catch (error) {
            AppAlert.alert(getErrorMessage(error, 'No se pudieron cargar las rutinas.'));
        } finally {
            setLoading(false);
        }
    }, [clientId]);

    useFocusEffect(
        useCallback(() => {
            load();
        }, [load]),
    );

    function edit(routine: Routine) {
        router.push({
            pathname: '/edit-template/[id]',
            params: { id: routine.id, clientId },
        });
    }

    async function remove(routineId: string) {
        try {
            await deleteRoutine(routineId);
            setRoutines((prev) => prev.filter((routine) => routine.id !== routineId));
        } catch (error) {
            AppAlert.alert(getErrorMessage(error, 'No se pudo eliminar la rutina.'));
        }
    }

    function confirmDelete(routine: Routine) {
        AppAlert.alert(
            'Eliminar rutina',
            `¿Eliminar "${routine.title}"? El cliente dejará de verla en su calendario.`,
            [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Eliminar', style: 'destructive', onPress: () => remove(routine.id) },
            ],
        );
    }

    return { routines, loading, edit, confirmDelete };
}
