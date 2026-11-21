import { View, StyleSheet } from 'react-native';
import { Card, Text, Icon, useTheme } from 'react-native-paper';
import type { SessionRating } from '../api/types';
import { EFFORT_LEVELS, effortLabel } from '../features/ratings/effort';
import { formatDateTime } from '../utils/format';

type Props = {
    rating: SessionRating;
};

// La paleta de la app es neutra: el esfuerzo se representa con grises cada vez más oscuros.
const EFFORT_SHADES: Record<number, { background: string; text: string }> = {
    1: { background: '#E5E5E5', text: '#111111' },
    2: { background: '#BDBDBD', text: '#111111' },
    3: { background: '#8A8A8A', text: '#FFFFFF' },
    4: { background: '#525252', text: '#FFFFFF' },
    5: { background: '#111111', text: '#FFFFFF' },
};

export function RatingRow({ rating }: Props) {
    const { colors } = useTheme();
    const shade = EFFORT_SHADES[rating.effort] ?? EFFORT_SHADES[3];
    const sessionName =
        rating.routineTitle ?? (rating.routineId ? 'Rutina eliminada' : 'Sesión sin rutina');
    const missingRoutine = !rating.routineTitle;

    return (
        <Card mode="outlined" style={[styles.card, { borderColor: colors.outlineVariant }]}>
            <Card.Content style={styles.content}>
                <View style={styles.header}>
                    <View style={[styles.badge, { backgroundColor: shade.background }]}>
                        <Text variant="titleLarge" style={[styles.badgeValue, { color: shade.text }]}>
                            {rating.effort}
                        </Text>
                        <Text variant="labelSmall" style={{ color: shade.text }}>
                            / 5
                        </Text>
                    </View>

                    <View style={styles.info}>
                        <Text
                            variant="titleMedium"
                            numberOfLines={2}
                            style={[
                                styles.title,
                                missingRoutine && {
                                    color: colors.onSurfaceVariant,
                                    fontStyle: 'italic',
                                },
                            ]}
                        >
                            {sessionName}
                        </Text>
                        <Text variant="labelLarge" style={{ color: colors.onSurfaceVariant }}>
                            {effortLabel(rating.effort)}
                        </Text>
                        <View
                            style={styles.meter}
                            accessibilityLabel={`Esfuerzo ${rating.effort} de 5`}
                        >
                            {EFFORT_LEVELS.map((level) => (
                                <View
                                    key={level.value}
                                    style={[
                                        styles.meterSegment,
                                        {
                                            backgroundColor:
                                                level.value <= rating.effort
                                                    ? shade.background
                                                    : colors.surfaceVariant,
                                        },
                                    ]}
                                />
                            ))}
                        </View>
                    </View>
                </View>

                {rating.note ? (
                    <View
                        style={[
                            styles.note,
                            {
                                backgroundColor: colors.surfaceVariant,
                                borderLeftColor: colors.primary,
                            },
                        ]}
                    >
                        <Icon source="comment-quote-outline" size={16} color={colors.onSurfaceVariant} />
                        <Text variant="bodyMedium" style={styles.noteText}>
                            {rating.note}
                        </Text>
                    </View>
                ) : null}

                <View style={styles.footer}>
                    <Icon source="calendar-blank-outline" size={14} color={colors.onSurfaceVariant} />
                    <Text variant="bodySmall" style={{ color: colors.onSurfaceVariant }}>
                        {formatDateTime(rating.createdAt)}
                    </Text>
                </View>
            </Card.Content>
        </Card>
    );
}

const styles = StyleSheet.create({
    card: {
        marginBottom: 12,
        borderRadius: 16,
    },
    content: {
        paddingVertical: 14,
        gap: 12,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
    },
    badge: {
        width: 56,
        height: 56,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    badgeValue: {
        fontWeight: 'bold',
        lineHeight: 26,
    },
    info: {
        flex: 1,
        gap: 2,
    },
    title: {
        fontWeight: '600',
    },
    meter: {
        flexDirection: 'row',
        gap: 4,
        marginTop: 6,
    },
    meterSegment: {
        flex: 1,
        height: 6,
        borderRadius: 3,
    },
    note: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 8,
        padding: 12,
        borderRadius: 10,
        borderLeftWidth: 3,
    },
    noteText: {
        flex: 1,
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
});
