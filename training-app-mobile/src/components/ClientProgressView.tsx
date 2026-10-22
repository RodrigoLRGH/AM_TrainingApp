import { View, ScrollView, StyleSheet } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { useClientMeasurements } from '../features/progress/useClientMeasurements';
import { METRICS } from '../features/progress/metrics';
import { MetricChips } from './MetricChips';
import { ProgressCard } from './ProgressCard';

type Props = {
    clientId: string;
};

export function ClientProgressView({ clientId }: Props) {
    const { loading, metric, setMetric, series } = useClientMeasurements(clientId);
    const current = METRICS.find((item) => item.key === metric) ?? METRICS[0];

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <ScrollView>
            <MetricChips selected={metric} onSelect={setMetric} />
            <ProgressCard metric={current} points={series} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    center: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});