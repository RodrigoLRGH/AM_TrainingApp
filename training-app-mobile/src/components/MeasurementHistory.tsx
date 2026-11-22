import { View, StyleSheet } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';
import type { Measurement } from '../api/types';
import { METRICS } from '../features/progress/metrics';
import { formatFullDate } from '../utils/format';

type Props = {
    /** Mediciones en orden cronológico; se muestran de la más reciente a la más antigua. */
    measurements: Measurement[];
};

export function MeasurementHistory({ measurements }: Props) {
    const { colors } = useTheme();

    if (measurements.length === 0) {
        return null;
    }

    const newestFirst = [...measurements].reverse();

    return (
        <View style={styles.container}>
            <Text variant="titleMedium" style={styles.title}>
                Historial de mediciones
            </Text>
            {newestFirst.map((measurement) => (
                <Card key={measurement.id} mode="outlined" style={styles.card}>
                    <Card.Content>
                        <Text variant="labelLarge" style={styles.date}>
                            {formatFullDate(measurement.recordedAt)}
                        </Text>
                        <View style={styles.values}>
                            {METRICS.map((item) => {
                                const value = measurement[item.key];
                                if (value === null) {
                                    return null;
                                }
                                return (
                                    <View
                                        key={item.key}
                                        style={[
                                            styles.value,
                                            { backgroundColor: colors.surfaceVariant },
                                        ]}
                                    >
                                        <Text
                                            variant="bodySmall"
                                            style={{ color: colors.onSurfaceVariant }}
                                        >
                                            {item.label}
                                        </Text>
                                        <Text variant="bodyMedium" style={styles.number}>
                                            {value.toFixed(1)} {item.unit}
                                        </Text>
                                    </View>
                                );
                            })}
                        </View>
                    </Card.Content>
                </Card>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
    title: {
        fontWeight: '600',
        marginBottom: 12,
    },
    card: {
        marginBottom: 12,
    },
    date: {
        marginBottom: 8,
    },
    values: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    value: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    number: {
        fontWeight: '600',
    },
});
