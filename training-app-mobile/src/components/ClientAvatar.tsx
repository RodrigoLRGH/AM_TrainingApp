import { View, StyleSheet } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { initials } from '../utils/format';

type Props = {
    name: string;
    muted?: boolean;
    backgroundColor?: string;
    textColor?: string;
};

export function ClientAvatar({ name, muted = false, backgroundColor, textColor }: Props) {
    const { colors } = useTheme();

    const background = backgroundColor ?? (muted ? colors.surfaceVariant : colors.primary);
    const text = textColor ?? (muted ? colors.onSurfaceVariant : colors.onPrimary);

    return (
        <View style={[styles.circle, { backgroundColor: background }]}>
            <Text variant="titleSmall" style={[styles.text, { color: text }]}>
                {initials(name)}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    circle: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontWeight: 'bold',
    },
});