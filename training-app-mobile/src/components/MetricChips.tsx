import { ScrollView, StyleSheet } from 'react-native';
import { Chip } from 'react-native-paper';
import type { MeasureKey } from '../api/types';
import { METRICS } from '../features/progress/metrics';

type Props = {
    selected: MeasureKey;
    onSelect: (key: MeasureKey) => void;
};

export function MetricChips({ selected, onSelect }: Props) {
    return (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
            {METRICS.map((item) => (
                <Chip
                    key={item.key}
                    selected={selected === item.key}
                    onPress={() => onSelect(item.key)}
                    style={styles.chip}
                >
                    {item.label}
                </Chip>
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    row: {
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    chip: {
        marginRight: 8,
    },
});