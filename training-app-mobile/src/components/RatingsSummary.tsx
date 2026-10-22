import { StyleSheet } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';

type Props = {
    average: number;
    count: number;
};

export function RatingsSummary({ average, count }: Props) {
    const theme = useTheme();
    const textColor = { color: theme.colors.onPrimary };

    return (
        <Card style={[styles.card, { backgroundColor: theme.colors.primary }]}>
            <Card.Content>
                <Text variant="bodyMedium" style={textColor}>
                    Esfuerzo promedio
                </Text>
                <Text variant="displaySmall" style={[styles.value, textColor]}>
                    {average.toFixed(1)} / 5
                </Text>
                <Text variant="bodySmall" style={textColor}>
                    {count} {count === 1 ? 'sesión calificada' : 'sesiones calificadas'}
                </Text>
            </Card.Content>
        </Card>
    );
}

const styles = StyleSheet.create({
    card: {
        marginBottom: 20,
    },
    value: {
        fontWeight: 'bold',
        marginVertical: 4,
    },
});