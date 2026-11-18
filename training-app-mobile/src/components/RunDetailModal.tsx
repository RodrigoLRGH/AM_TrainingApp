import { View, StyleSheet } from 'react-native';
import { Text, Portal, Modal, Button, useTheme } from 'react-native-paper';
import type { Coordinate, RunSession } from '../api/types';
import { formatDayLabel } from '../utils/format';
import { RunMap } from './RunMap';
import { RunStats } from './RunStats';

type Props = {
    run: RunSession | null;
    onDismiss: () => void;
};

export function RunDetailModal({ run, onDismiss }: Props) {
    const { colors } = useTheme();
    const route: Coordinate[] =
        run?.points?.map((point) => ({
            latitude: point.latitude,
            longitude: point.longitude,
        })) ?? [];

    const time = run
        ? new Date(run.startedAt).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })
        : '';

    return (
        <Portal>
            <Modal
                visible={run !== null}
                onDismiss={onDismiss}
                contentContainerStyle={[styles.modal, { backgroundColor: colors.surface }]}
            >
                <Text variant="titleLarge" style={styles.title}>
                    Tu recorrido
                </Text>
                {run ? (
                    <Text variant="bodyMedium" style={styles.subtitle}>
                        {formatDayLabel(run.startedAt)} · {time}
                    </Text>
                ) : null}

                <View style={[styles.map, { borderColor: colors.outlineVariant }]}>
                    <RunMap route={route} />
                </View>

                <View style={[styles.stats, { backgroundColor: colors.surfaceVariant }]}>
                    <RunStats
                        distanceMeters={run?.distanceMeters ?? 0}
                        durationSeconds={run?.durationSeconds ?? 0}
                    />
                </View>

                <Button mode="contained" onPress={onDismiss}>
                    Cerrar
                </Button>
            </Modal>
        </Portal>
    );
}

const styles = StyleSheet.create({
    modal: {
        padding: 24,
        margin: 24,
        borderRadius: 16,
    },
    title: {
        fontWeight: 'bold',
    },
    subtitle: {
        color: '#666',
        marginTop: 2,
        marginBottom: 16,
    },
    map: {
        height: 280,
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: StyleSheet.hairlineWidth,
    },
    stats: {
        borderRadius: 12,
        marginVertical: 16,
    },
});
