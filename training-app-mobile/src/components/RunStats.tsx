import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { formatDuration, formatKm, formatPace } from '../utils/format';

type Props = {
    distanceMeters: number;
    durationSeconds: number;
};

type StatProps = {
    value: string;
    label: string;
};

function Stat({ value, label }: StatProps) {
    return (
        <View style={styles.stat}>
            <Text variant="headlineSmall" style={styles.value}>
                {value}
            </Text>
            <Text variant="bodySmall" style={styles.label}>
                {label}
            </Text>
        </View>
    );
}

export function RunStats({ distanceMeters, durationSeconds }: Props) {
    return (
        <View style={styles.row}>
            <Stat value={formatKm(distanceMeters)} label="km" />
            <Stat value={formatDuration(durationSeconds)} label="tiempo" />
            <Stat value={formatPace(distanceMeters, durationSeconds)} label="min/km" />
        </View>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 16,
    },
    stat: {
        alignItems: 'center',
    },
    value: {
        fontWeight: 'bold',
    },
    label: {
        color: '#666',
    },
});