import { StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

type Props = {
    title: string;
};

export function SectionHeader({ title }: Props) {
    return (
        <Text variant="titleMedium" style={styles.title}>
            {title}
        </Text>
    );
}

const styles = StyleSheet.create({
    title: {
        fontWeight: '700',
        color: '#1F2A25',
        marginBottom: 12,
    },
});