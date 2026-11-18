import { View, StyleSheet } from 'react-native';
import { Card, Text, Icon, useTheme } from 'react-native-paper';
import type { RunSession } from '../api/types';
import { formatDayLabel, formatDuration, formatKm, formatPace } from '../utils/format';

type Props = {
    run: RunSession;
    onPress: (id: string) => void;
};

type MetricProps = {
    icon: string;
    value: string;
    unit?: string;
};

function Metric({ icon, value, unit }: MetricProps) {
    return (
        <View style={styles.metric}>
            <Icon source={icon} size={16} color="#666" />
            <Text variant="bodyMedium" style={styles.metricValue}>
                {value}
                {unit ? <Text variant="bodySmall" style={styles.unit}> {unit}</Text> : null}
            </Text>
        </View>
    );
}

export function RunCard({ run, onPress }: Props) {
    const { colors } = useTheme();
    const distance = run.distanceMeters ?? 0;
    const duration = run.durationSeconds ?? 0;

    const time = new Date(run.startedAt).toLocaleTimeString('es-MX', {
        hour: '2-digit',
        minute: '2-digit',
    });

    return (
        <Card mode="outlined" style={styles.card} onPress={() => onPress(run.id)}>
            <View style={styles.body}>
                <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
                    <Icon source="run" size={24} color={colors.onPrimary} />
                </View>

                <View style={styles.info}>
                    <Text variant="titleMedium" style={styles.date} numberOfLines={1}>
                        {formatDayLabel(run.startedAt)}
                    </Text>
                    <Text variant="bodySmall" style={styles.time}>
                        {time}
                    </Text>

                    <View style={styles.metrics}>
                        <Metric icon="map-marker-distance" value={formatKm(distance)} unit="km" />
                        <Metric icon="timer-outline" value={formatDuration(duration)} />
                        <Metric icon="speedometer" value={formatPace(distance, duration)} unit="/km" />
                    </View>
                </View>

                <Icon source="chevron-right" size={22} color="#666" />
            </View>
        </Card>
    );
}

const styles = StyleSheet.create({
    card: {
        marginBottom: 12,
    },
    body: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    avatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 14,
    },
    info: {
        flex: 1,
    },
    date: {
        fontWeight: 'bold',
    },
    time: {
        color: '#666',
        marginBottom: 8,
    },
    metrics: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    metric: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 14,
    },
    metricValue: {
        marginLeft: 4,
        fontWeight: '600',
    },
    unit: {
        color: '#666',
    },
});
