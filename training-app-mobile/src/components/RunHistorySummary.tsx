import { View, StyleSheet } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';
import type { RunSession } from '../api/types';
import { formatDuration, formatKm, formatPace } from '../utils/format';

type Props = {
    runs: RunSession[];
};

type ItemProps = {
    value: string;
    label: string;
    color: string;
};

function SummaryItem({ value, label, color }: ItemProps) {
    return (
        <View style={styles.item}>
            <Text variant="titleMedium" style={[styles.itemValue, { color }]}>
                {value}
            </Text>
            <Text variant="bodySmall" style={{ color, opacity: 0.75 }}>
                {label}
            </Text>
        </View>
    );
}

export function RunHistorySummary({ runs }: Props) {
    const { colors } = useTheme();
    const textColor = colors.onPrimary;

    const totalMeters = runs.reduce((sum, run) => sum + (run.distanceMeters ?? 0), 0);
    const totalSeconds = runs.reduce((sum, run) => sum + (run.durationSeconds ?? 0), 0);

    return (
        <Card style={[styles.card, { backgroundColor: colors.primary }]}>
            <Card.Content>
                <Text variant="bodyMedium" style={{ color: textColor, opacity: 0.75 }}>
                    Distancia total
                </Text>
                <Text variant="displaySmall" style={[styles.total, { color: textColor }]}>
                    {formatKm(totalMeters)} km
                </Text>

                <View style={[styles.divider, { backgroundColor: textColor }]} />

                <View style={styles.row}>
                    <SummaryItem
                        value={String(runs.length)}
                        label={runs.length === 1 ? 'corrida' : 'corridas'}
                        color={textColor}
                    />
                    <SummaryItem value={formatDuration(totalSeconds)} label="tiempo total" color={textColor} />
                    <SummaryItem
                        value={formatPace(totalMeters, totalSeconds)}
                        label="ritmo prom."
                        color={textColor}
                    />
                </View>
            </Card.Content>
        </Card>
    );
}

const styles = StyleSheet.create({
    card: {
        marginBottom: 20,
    },
    total: {
        fontWeight: 'bold',
        marginVertical: 4,
    },
    divider: {
        height: StyleSheet.hairlineWidth,
        opacity: 0.3,
        marginVertical: 12,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    item: {
        flex: 1,
        alignItems: 'center',
    },
    itemValue: {
        fontWeight: 'bold',
    },
});
