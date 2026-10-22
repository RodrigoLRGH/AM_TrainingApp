import { StyleSheet } from 'react-native';
import { Card, Text } from 'react-native-paper';
import type { ChartPoint, Metric } from '../features/progress/metrics';
import { MeasurementChart } from './MeasurementChart';

type Props = {
    metric: Metric;
    points: ChartPoint[];
};

function changeText(points: ChartPoint[], unit: string) {
    if (points.length < 2) {
        return 'Registra otra medición para ver tu evolución.';
    }

    const change = points[points.length - 1].value - points[0].value;
    const sign = change > 0 ? '+' : '';
    return `${sign}${change.toFixed(1)} ${unit} desde el primer registro`;
}

export function ProgressCard({ metric, points }: Props) {
    if (points.length === 0) {
        return (
            <Card style={styles.card}>
                <Card.Content>
                    <Text variant="bodyLarge" style={styles.empty}>
                        Todavía no registras {metric.label.toLowerCase()}.
                    </Text>
                </Card.Content>
            </Card>
        );
    }

    const latest = points[points.length - 1].value;

    return (
        <Card style={styles.card}>
            <Card.Content>
                <Text variant="bodyMedium" style={styles.label}>
                    {metric.label} actual
                </Text>
                <Text variant="headlineMedium" style={styles.value}>
                    {latest.toFixed(1)} {metric.unit}
                </Text>
                <Text variant="bodySmall" style={styles.change}>
                    {changeText(points, metric.unit)}
                </Text>
                <MeasurementChart points={points} />
            </Card.Content>
        </Card>
    );
}

const styles = StyleSheet.create({
    card: {
        margin: 16,
    },
    label: {
        color: '#666',
    },
    value: {
        fontWeight: 'bold',
        marginVertical: 4,
    },
    change: {
        color: '#666',
        marginBottom: 16,
    },
    empty: {
        textAlign: 'center',
        color: '#999',
    },
});