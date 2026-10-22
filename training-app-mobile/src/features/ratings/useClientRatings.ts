import { useCallback, useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { getClientRatings } from '../../api/ratings';
import { getErrorMessage } from '../../api/errors';
import type { SessionRating } from '../../api/types';

export function useClientRatings(clientId: string) {
    const [ratings, setRatings] = useState<SessionRating[]>([]);
    const [loading, setLoading] = useState(true);

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getClientRatings(clientId);
            setRatings(data);
        } catch (error) {
            Alert.alert(getErrorMessage(error, 'No se pudieron cargar las calificaciones.'));
        } finally {
            setLoading(false);
        }
    }, [clientId]);

    useFocusEffect(
        useCallback(() => {
            load();
        }, [load]),
    );

    const average = useMemo(() => {
        if (ratings.length === 0) {
            return null;
        }

        const total = ratings.reduce((sum, rating) => sum + rating.effort, 0);
        return total / ratings.length;
    }, [ratings]);

    return { ratings, loading, average };
}