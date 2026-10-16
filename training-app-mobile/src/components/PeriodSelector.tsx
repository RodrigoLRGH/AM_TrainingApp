import { StyleSheet } from 'react-native';
import { SegmentedButtons } from 'react-native-paper';
import type { PeriodDays } from '../features/stats/useDashboard';

type Props = {
    days: PeriodDays;
    onChange: (days: PeriodDays) => void;
};

export function PeriodSelector({ days, onChange }: Props) {
    function handleChange(value: string) {
        if (value === '7') onChange(7);
        if (value === '30') onChange(30);
        if (value === '90') onChange(90);
    }

    return (
        <SegmentedButtons
            value={String(days)}
            onValueChange={handleChange}
            buttons={[
                { value: '7', label: '7 días' },
                { value: '30', label: '30 días' },
                { value: '90', label: '90 días' },
            ]}
            style={styles.selector}
        />
    );
}

const styles = StyleSheet.create({
    selector: {
        marginBottom: 16,
    },
});