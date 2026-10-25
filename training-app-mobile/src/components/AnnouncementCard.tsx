import { View, StyleSheet } from 'react-native';
import { Card, Text, Icon, useTheme } from 'react-native-paper';
import type { Announcement } from '../api/types';
import { formatDateTime } from '../utils/format';

type Props = {
    announcement: Announcement;
};

export function AnnouncementCard({ announcement }: Props) {
    const { colors } = useTheme();

    return (
        <Card mode="outlined" style={styles.card}>
            <View style={styles.row}>
                <View style={[styles.iconCircle, { backgroundColor: colors.primaryContainer }]}>
                    <Icon source="bullhorn-outline" size={22} color={colors.primary} />
                </View>

                <View style={styles.content}>
                    <Text variant="titleMedium" style={styles.title}>
                        {announcement.title}
                    </Text>
                    <Text variant="bodyMedium" style={styles.message}>
                        {announcement.message}
                    </Text>
                    <Text variant="bodySmall" style={{ color: colors.onSurfaceVariant }}>
                        {formatDateTime(announcement.createdAt)}
                    </Text>
                </View>
            </View>
        </Card>
    );
}

const styles = StyleSheet.create({
    card: {
        marginBottom: 12,
    },
    row: {
        flexDirection: 'row',
        padding: 14,
    },
    iconCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    content: {
        flex: 1,
    },
    title: {
        fontWeight: '700',
    },
    message: {
        marginVertical: 6,
    },
});