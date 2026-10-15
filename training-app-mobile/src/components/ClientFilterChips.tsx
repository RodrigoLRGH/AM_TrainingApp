import { ScrollView, StyleSheet } from 'react-native';
import { Chip } from 'react-native-paper';
import type { Client } from '../features/clients/useClients';

type Props = {
    clients: Client[];
    selectedClientId: string | null;
    onSelect: (clientId: string | null) => void;
};

export function ClientFilterChips({ clients, selectedClientId, onSelect }: Props) {
    return (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
            <Chip
                selected={selectedClientId === null}
                onPress={() => onSelect(null)}
                style={styles.chip}
            >
                Todos
            </Chip>
            {clients.map((client) => (
                <Chip
                    key={client.id}
                    selected={selectedClientId === client.id}
                    onPress={() => onSelect(client.id)}
                    style={styles.chip}
                >
                    {client.name}
                </Chip>
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    row: {
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    chip: {
        marginRight: 8,
    },
});