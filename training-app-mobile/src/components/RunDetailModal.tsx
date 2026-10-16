import { View, StyleSheet } from 'react-native';
import { Text, Portal, Modal, Button } from 'react-native-paper';
import type { Coordinate, RunSession } from '../api/types';
import { RunMap } from './RunMap';
import { RunStats } from './RunStats';

type Props = {
    run: RunSession | null;
    onDismiss: () => void;
};

export function RunDetailModal({ run, onDismiss }: Props) {
    const route: Coordinate[] =
        run?.points?.map((point) => ({
            latitude: point.latitude,
            longitude: point.longitude,
        })) ?? [];

    return (
        <Portal>
            <Modal visible={run !== null} onDismiss={onDismiss} contentContainerStyle={styles.modal}>
                <Text variant="titleMedium" style={styles.title}>
                    Tu recorrido
                </Text>
                <View style={styles.map}>
                    <RunMap route={route} />
                </View>
                <RunStats
                    distanceMeters={run?.distanceMeters ?? 0}
                    durationSeconds={run?.durationSeconds ?? 0}
                />
                <Button mode="contained" onPress={onDismiss}>
                    Cerrar
                </Button>
            </Modal>
        </Portal>
    );
}

const styles = StyleSheet.create({
    modal: {
        backgroundColor: 'white',
        padding: 24,
        margin: 24,
        borderRadius: 8,
    },
    title: {
        marginBottom: 16,
    },
    map: {
        height: 300,
    },
});