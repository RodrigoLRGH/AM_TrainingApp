import { ScrollView, StyleSheet } from 'react-native';
import { Text, Button, Checkbox, ActivityIndicator } from 'react-native-paper';
import type { Client } from '../api/types';
import { DateField } from './DateField';

type Props = {
    templateTitle: string;
    clients: Client[];
    loadingClients: boolean;
    selectedIds: string[];
    onToggleClient: (id: string) => void;
    date: Date;
    onDateChange: (date: Date) => void;
    minimumDate: Date;
    onSubmit: () => void;
    saving: boolean;
};

export function AssignTemplateForm({
    templateTitle,
    clients,
    loadingClients,
    selectedIds,
    onToggleClient,
    date,
    onDateChange,
    minimumDate,
    onSubmit,
    saving,
}: Props) {
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text variant="titleLarge" style={styles.title}>
                {templateTitle}
            </Text>

            <Text variant="labelLarge" style={styles.sectionLabel}>
                Clientes activos
            </Text>
            {loadingClients ? (
                <ActivityIndicator style={styles.loader} />
            ) : clients.length === 0 ? (
                <Text variant="bodyMedium" style={styles.empty}>
                    No tienes clientes activos todavía.
                </Text>
            ) : (
                clients.map((client) => (
                    <Checkbox.Item
                        key={client.id}
                        label={client.name}
                        status={selectedIds.includes(client.id) ? 'checked' : 'unchecked'}
                        onPress={() => onToggleClient(client.id)}
                    />
                ))
            )}

            <Text variant="labelLarge" style={[styles.sectionLabel, styles.dateLabel]}>
                Fecha
            </Text>
            <DateField value={date} onChange={onDateChange} minimumDate={minimumDate} />

            <Button
                mode="contained"
                onPress={onSubmit}
                loading={saving}
                disabled={saving || clients.length === 0}
                style={styles.submit}
            >
                Asignar rutina
            </Button>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        paddingBottom: 32,
    },
    title: {
        marginBottom: 24,
    },
    sectionLabel: {
        marginBottom: 8,
    },
    dateLabel: {
        marginTop: 24,
    },
    loader: {
        marginVertical: 16,
    },
    empty: {
        color: '#999',
    },
    submit: {
        marginTop: 24,
    },
});