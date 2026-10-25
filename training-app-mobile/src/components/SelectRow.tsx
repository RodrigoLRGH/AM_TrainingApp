import { Pressable, View, StyleSheet } from 'react-native';
import { Text, Icon, useTheme } from 'react-native-paper';

type Props = {
    title: string;
    subtitle?: string;
    selected: boolean;
    strikeWhenSelected?: boolean;
    onPress: () => void;
};

export function SelectRow({
    title,
    subtitle,
    selected,
    strikeWhenSelected = false,
    onPress,
}: Props) {
    const { colors } = useTheme();
    const struck = selected && strikeWhenSelected;

    return (
        <Pressable
            style={[
                styles.row,
                { backgroundColor: colors.surface, borderColor: colors.outlineVariant },
                selected && { backgroundColor: colors.primaryContainer, borderColor: colors.primary },
            ]}
            onPress={onPress}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: selected }}
        >
            <View
                style={[
                    styles.box,
                    { backgroundColor: colors.surface, borderColor: colors.outline },
                    selected && { backgroundColor: colors.primary, borderColor: colors.primary },
                ]}
            >
                {selected ? <Icon source="check" size={20} color={colors.onPrimary} /> : null}
            </View>

            <View style={styles.textContainer}>
                <Text
                    variant="bodyLarge"
                    style={[styles.title, struck && styles.done, struck && { color: colors.onSurfaceVariant }]}
                >
                    {title}
                </Text>
                {subtitle ? (
                    <Text variant="bodySmall" style={{ color: colors.onSurfaceVariant }}>
                        {subtitle}
                    </Text>
                ) : null}
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 12,
        marginBottom: 10,
    },
    box: {
        width: 28,
        height: 28,
        borderRadius: 8,
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontWeight: '600',
    },
    done: {
        textDecorationLine: 'line-through',
    },
});