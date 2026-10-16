import { StyleSheet } from 'react-native';
import { Card, Text } from 'react-native-paper';
import type { RunSession } from '../api/types';
import { formatDuration, formatKm, formatPace } from '../utils/format';

type Props = {
    run: RunSession;
    onPress: (id: string) => void;
};

export function RunCard({ run, onPress }: Props) {
    const distance = run.distanceMeters ?? 0;
    const duration = run.durationSeconds ?? 0;

    const date = new Date(run.startedAt).toLocaleDateString('es-MX', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
    });
    const time = new Date(run.startedAt).toLocaleTimeString('es-MX', {
        hour: '2-digit',
        minute: '2-digit',
    });

    return (
        <Card style={styles.card} onPress={() => onPress(run.id)}>
            <Card.Title title={date} subtitle={time} />
            <Card.Content>
                <Text variant="bodyLarge">
                    {formatKm(distance)} km · {formatDuration(duration)} · {formatPace(distance, duration)}{' '}
                    min/km
                </Text>
            </Card.Content>
        </Card>
    );
}

const styles = StyleSheet.create({
    card: {
        marginBottom: 12,
    },
});