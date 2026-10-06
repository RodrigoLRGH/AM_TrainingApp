import { StyleSheet } from 'react-native';
import { Card, Text } from 'react-native-paper';
import type { Template } from '../features/routines/useTemplates';

type Props = {
    template: Template;
};

export function TemplateCard({ template }: Props) {
    return (
        <Card style={styles.card}>
            <Card.Title title={template.title} subtitle={`${template.exercises.length} ejercicios`} />
            <Card.Content>
                {template.exercises.map((ex) => (
                    <Text key={ex.id} variant="bodyMedium">
                        • {ex.name} — {ex.sets}x{ex.reps}
                    </Text>
                ))}
            </Card.Content>
        </Card>
    );
}

const styles = StyleSheet.create({
    card: {
        marginBottom: 12,
    },
});