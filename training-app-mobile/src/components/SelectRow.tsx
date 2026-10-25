import { Pressable, View, StyleSheet } from 'react-native';
import { Text, Icon } from 'react-native-paper';

const GREEN = '#2E5D4F';
const GREEN_LIGHT = '#DCEDE3';
const BORDER = '#C9D1CD';
const BOX_BORDER = '#8A9A93';

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
    const struck = selected && strikeWhenSelected;

    return (
        <Pressable
            style={[styles.row, selected && styles.rowSelected]}
            onPress={onPress}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: selected }}
        >
            <View style={[styles.box, selected && styles.boxSelected]}>
                {selected ? <Icon source="check" size={20} color="#FFFFFF" /> : null}
            </View>

            <View style={styles.textContainer}>
                <Text variant="bodyLarge" style={struck ? styles.done : styles.title}>
                    {title}
                </Text>
                {subtitle ? (
                    <Text variant="bodySmall" style={styles.subtitle}>
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
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: BORDER,
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 12,
        marginBottom: 10,
    },
    rowSelected: {
        backgroundColor: GREEN_LIGHT,
        borderColor: GREEN,
    },
    box: {
        width: 28,
        height: 28,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: BOX_BORDER,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    boxSelected: {
        backgroundColor: GREEN,
        borderColor: GREEN,
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontWeight: '600',
    },
    done: {
        fontWeight: '600',
        textDecorationLine: 'line-through',
        color: '#6B7A73',
    },
    subtitle: {
        color: '#555',
    },
});