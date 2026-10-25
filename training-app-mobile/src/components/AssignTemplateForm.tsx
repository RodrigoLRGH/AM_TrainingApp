import { ScrollView, View, StyleSheet } from 'react-native';
import { Text, Button, ActivityIndicator } from 'react-native-paper';
import type { Client } from '../api/types';
import { SectionHeader } from './SectionHeader';
import { SelectRow } from './SelectRow';
import { DateField } from './DateField';

type Props = {
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
            <SectionHeader title="Clientes activos" />
            {loadingClients ? (
                <ActivityIndicator style={styles.loader} />
            ) : clients.length === 0 ? (
                <Text variant="bodyMedium" style={styles.empty}>
                    No tienes clientes activos todavía.
                </Text>
            ) : (
                clients.map((client) => (
                    <SelectRow
                        key={client.id}
                        title={client.name}
                        selected={selectedIds.includes(client.id)}
                        onPress={() => onToggleClient(client.id)}
                    />
                ))
            )}

            <View style={styles.dateSection}>
                <SectionHeader title="Fecha" />
                <DateField value={date} onChange={onDateChange} minimumDate={minimumDate} />
            </View>

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
    loader: {
        marginVertical: 16,
    },
    empty: {
        color: '#999',
    },
    dateSection: {
        marginTop: 20,
    },
    submit: {
        marginTop: 24,
    },
});