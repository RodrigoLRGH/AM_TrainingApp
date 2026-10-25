import { View, StyleSheet } from 'react-native';
import { Card, Text, Icon, useTheme } from 'react-native-paper';
import type { Routine } from '../api/types';
import { RoutineDateBadge } from './RoutineDateBadge';

type Props = {
    routine: Routine;
    onPress?: (id: string) => void;
};

export function RoutineSummaryCard({ routine, onPress }: Props) {
    const theme = useTheme();
    const count = routine.exercises.length;

    return (
        <Card
            mode="outlined"
            style={styles.card}
            onPress={onPress ? () => onPress(routine.id) : undefined}
        >
            <View style={[styles.banner, { backgroundColor: theme.colors.primary }]}>
                <Text variant="titleLarge" style={[styles.title, { color: theme.colors.onPrimary }]}>
                    {routine.title}
                </Text>
            </View>

            <View style={styles.body}>
                <RoutineDateBadge date={routine.date} />
                <View style={styles.meta}>
                    <Text variant="bodyMedium" style={styles.count}>
                        {count} {count === 1 ? 'ejercicio' : 'ejercicios'}
                    </Text>
                    {onPress ? <Icon source="chevron-right" size={22} color="#666" /> : null}
                </View>
            </View>
        </Card>
    );
}

const styles = StyleSheet.create({
    card: {
        marginBottom: 16,
        overflow: 'hidden',
    },
    banner: {
        paddingHorizontal: 16,
        paddingVertical: 14,
    },
    title: {
        fontWeight: 'bold',
    },
    body: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
    },
    meta: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    count: {
        color: '#666',
        marginRight: 4,
    },
});