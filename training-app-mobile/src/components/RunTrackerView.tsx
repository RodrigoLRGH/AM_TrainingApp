import { View, StyleSheet } from 'react-native';
import { Card, Text, Button } from 'react-native-paper';
import type { RunTracker } from '../features/running/useRunTracker';
import { RunMap } from './RunMap';
import { RunStats } from './RunStats';

type Props = {
    tracker: RunTracker;
};

export function RunTrackerView({ tracker }: Props) {
    const { status, route, distanceMeters, elapsedSeconds, result, start, finish, reset } = tracker;
    const active = status === 'running' || status === 'finishing';

    if (result) {
        return (
            <View style={styles.container}>
                <View style={styles.map}>
                    <RunMap route={route} />
                </View>
                <RunStats
                    distanceMeters={result.distanceMeters ?? 0}
                    durationSeconds={result.durationSeconds ?? 0}
                />
                <View style={styles.footer}>
                    <Button mode="contained" onPress={reset}>
                        Nueva corrida
                    </Button>
                </View>
            </View>
        );
    }

    if (active) {
        return (
            <View style={styles.container}>
                <View style={styles.map}>
                    <RunMap route={route} follow />
                </View>
                <RunStats distanceMeters={distanceMeters} durationSeconds={elapsedSeconds} />
                <View style={styles.footer}>
                    <Button
                        mode="contained"
                        onPress={finish}
                        loading={status === 'finishing'}
                        disabled={status === 'finishing'}
                    >
                        Terminar corrida
                    </Button>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Card style={styles.card}>
                <Card.Title title="Corrida" />
                <Card.Content>
                    <Text variant="bodyMedium" style={styles.hint}>
                        Registramos tu ruta, distancia y tiempo. Mantén la app abierta durante la corrida: si
                        bloqueas el teléfono, el registro se pausa.
                    </Text>
                    <Button
                        mode="contained"
                        onPress={start}
                        loading={status === 'starting'}
                        disabled={status === 'starting'}
                    >
                        Iniciar corrida
                    </Button>
                </Card.Content>
            </Card>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        flex: 1,
    },
    footer: {
        padding: 16,
    },
    card: {
        margin: 16,
    },
    hint: {
        marginBottom: 16,
        color: '#666',
    },
});