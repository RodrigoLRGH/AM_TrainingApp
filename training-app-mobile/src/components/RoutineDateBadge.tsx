import { View, StyleSheet } from 'react-native';
import { Text, Icon } from 'react-native-paper';
import { formatDayLabel } from '../utils/format';

const BADGE_COLOR = '#2E5D4F';
const BADGE_TEXT_COLOR = '#FFFFFF';

type Props = {
    date: string;
};

export function RoutineDateBadge({ date }: Props) {
    return (
        <View style={styles.badge}>
            <Icon source="calendar" size={18} color={BADGE_TEXT_COLOR} />
            <Text variant="labelLarge" style={styles.text}>
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
        backgroundColor: BADGE_COLOR,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    text: {
        marginLeft: 6,
        fontWeight: 'bold',
        color: BADGE_TEXT_COLOR,
    },
});