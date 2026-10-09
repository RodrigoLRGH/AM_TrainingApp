import { ScrollView, StyleSheet } from 'react-native';
import {
    Text,
    Portal,
    Modal,
    TextInput,
    Button,
    Checkbox,
    ActivityIndicator,
} from 'react-native-paper';
import type { Client } from '../features/clients/useClients';

type Props = {
    visible: boolean;
    templateTitle: string;
    onDismiss: () => void;
    clients: Client[];
    loadingClients: boolean;
    selectedIds: string[];
    onToggleClient: (id: string) => void;
    date: string;
    onDateChange: (value: string) => void;
    onSubmit: () => void;
    saving: boolean;
};

export function AssignTemplateModal({
    visible,
    templateTitle,
    onDismiss,
    clients,
    loadingClients,
    selectedIds,
    onToggleClient,
    date,
    onDateChange,
    onSubmit,
    saving,
}: Props) {
    return (
        <Portal>
            <Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={styles.modal}>
                <Text variant="titleMedium" style={styles.title}>
                    Asignar "{templateTitle}"
                </Text>

                <Text variant="labelLarge" style={styles.sectionLabel}>
                    Clientes activos
                </Text>

                {loadingClients ? (
                    <ActivityIndicator style={styles.loader} />
                ) : clients.length === 0 ? (
                    <Text style={styles.empty}>No tienes clientes activos todavía.</Text>
                ) : (
                    <ScrollView style={styles.list}>
                        {clients.map((client) => (
                            <Checkbox.Item
                                key={client.id}
                                label={client.name}
                                status={selectedIds.includes(client.id) ? 'checked' : 'unchecked'}
                                onPress={() => onToggleClient(client.id)}
                            />
                        ))}
                    </ScrollView>
                )}

                <TextInput
                    label="Fecha (AAAA-MM-DD)"
                    value={date}
                    onChangeText={onDateChange}
                    style={styles.input}
                />

                <Button mode="contained" onPress={onSubmit} loading={saving} disabled={saving}>
                    Asignar
                </Button>
            </Modal>
        </Portal>
    );
}

const styles = StyleSheet.create({
    modal: {
        backgroundColor: 'white',
        padding: 24,
        margin: 24,
        borderRadius: 8,
        maxHeight: '85%',
    },
    title: {
        marginBottom: 16,
    },
    sectionLabel: {
        marginBottom: 8,
    },
    loader: {
        marginVertical: 16,
    },
    empty: {
        color: '#999',
        marginBottom: 16,
    },
    list: {
        maxHeight: 220,
        marginBottom: 16,
    },
    input: {
        marginBottom: 16,
    },
});