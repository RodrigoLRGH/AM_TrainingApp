import { StyleSheet } from 'react-native';
import { Card, Text, TextInput, Button } from 'react-native-paper';
import type { GymConfig } from '../features/attendance/useGymSetup';

type Props = {
    config: GymConfig | null;
    radius: string;
    onRadiusChange: (value: string) => void;
    onSave: () => void;
    saving: boolean;
};

export function GymLocationCard({ config, radius, onRadiusChange, onSave, saving }: Props) {
    const configured = config?.gymLatitude != null && config?.gymLongitude != null;

    return (
        <Card style={styles.card}>
            <Card.Title title="Ubicación del gimnasio" />
            <Card.Content>
                <Text variant="bodyMedium" style={styles.status}>
                    {configured
                        ? `Configurada (radio actual: ${config?.gymRadiusMeters} m)`
                        : 'Todavía no has configurado la ubicación.'}
                </Text>
                <TextInput
                    label="Radio permitido (metros)"
                    value={radius}
                    onChangeText={onRadiusChange}
                    keyboardType="numeric"
                    style={styles.input}
                />
            </Card.Content>
            <Card.Actions>
                <Button mode="contained" onPress={onSave} loading={saving} disabled={saving}>
                    Usar mi ubicación actual
                </Button>
            </Card.Actions>
        </Card>
    );
}

const styles = StyleSheet.create({
    card: {
        marginBottom: 16,
    },
    status: {
        marginBottom: 12,
        color: '#666',
    },
    input: {
        marginBottom: 8,
    },
});