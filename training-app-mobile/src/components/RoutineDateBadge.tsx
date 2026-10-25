import { View, StyleSheet } from 'react-native';
import { Text, Icon, useTheme } from 'react-native-paper';
import { formatDayLabel } from '../utils/format';

type Props = {
    date: string;
};

export function RoutineDateBadge({ date }: Props) {
    const { colors } = useTheme();

    return (
        <View style={[styles.badge, { backgroundColor: colors.primary }]}>
            <Icon source="calendar" size={18} color={colors.onPrimary} />
            <Text variant="labelLarge" style={[styles.text, { color: colors.onPrimary }]}>
                {formatDayLabel(date)}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    text: {
        marginLeft: 6,
        fontWeight: 'bold',
    },
});