import { StyleSheet } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

type Props = {
    title: string;
};

export function SectionHeader({ title }: Props) {
    const { colors } = useTheme();

    return (
        <Text variant="titleMedium" style={[styles.title, { color: colors.onSurface }]}>
            {title}
        </Text>
    );
}

const styles = StyleSheet.create({
    title: {
        fontWeight: '700',
        marginBottom: 12,
    },
});