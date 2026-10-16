import { StyleSheet } from 'react-native';
import { Card, Text } from 'react-native-paper';

type Props = {
    label: string;
    value: string;
    hint?: string;
};

export function StatCard({ label, value, hint }: Props) {
    return (
        <Card style={styles.card}>
            <Card.Content>
                <Text variant="bodyMedium" style={styles.label}>
                    {label}
                </Text>
                <Text variant="headlineMedium" style={styles.value}>
                    {value}
                </Text>
                {hint ? (
                    <Text variant="bodySmall" style={styles.hint}>
                        {hint}
                    </Text>
                ) : null}
            </Card.Content>
        </Card>
    );
}

const styles = StyleSheet.create({
    card: {
        width: '48%',
        marginBottom: 16,
    },
    label: {
        color: '#666',
    },
    value: {
        fontWeight: 'bold',
        marginVertical: 4,
    },
    hint: {
        color: '#999',
    },
});