import { StyleSheet } from 'react-native';
import { Card, Chip, Button } from 'react-native-paper';
import type { Client } from '../api/types';

type Props = {
    client: Client;
    onViewRatings: (client: Client) => void;
};

export function ClientCard({ client, onViewRatings }: Props) {
    return (
        <Card style={styles.card}>
            <Card.Title
                title={client.name}
                subtitle={`Código: ${client.clientCode}`}
                right={() => <Chip style={styles.chip}>{client.active ? 'Activo' : 'Inactivo'}</Chip>}
            />
            <Card.Actions>
                <Button onPress={() => onViewRatings(client)}>Calificaciones</Button>
            </Card.Actions>
        </Card>
    );
}

const styles = StyleSheet.create({
    card: {
        marginBottom: 12,
    },
    chip: {
        alignSelf: 'center',
        marginRight: 16,
    },
});