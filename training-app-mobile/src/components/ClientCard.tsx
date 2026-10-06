import { StyleSheet } from 'react-native';
import { Card, Chip } from 'react-native-paper';
import type { Client } from '../features/clients/useClients';

type Props = {
    client: Client;
};

export function ClientCard({ client }: Props) {
    return (
        <Card style={styles.card}>
            <Card.Title
                title={client.name}
                subtitle={`Código: ${client.clientCode}`}
                right={() => (
                    <Chip style={styles.chip}>{client.active ? 'Activo' : 'Inactivo'}</Chip>
                )}
            />
        </Card>
    );
}

const styles = StyleSheet.create({
    card: {
        marginBottom: 12,
    },
    chip: {
        alignSelf: 'center',
    },
});