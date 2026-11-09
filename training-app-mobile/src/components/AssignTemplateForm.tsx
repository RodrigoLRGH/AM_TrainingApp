import { ScrollView, View, StyleSheet } from 'react-native';
import { Text, Button, ActivityIndicator } from 'react-native-paper';
import type { AssignTemplateApi } from '../features/routines/useAssignTemplate';
import { SectionHeader } from './SectionHeader';
import { SelectRow } from './SelectRow';
import { DateField } from './DateField';
import { AdjustExercisesModal } from './AdjustExercisesModal';

type Props = {
    assign: AssignTemplateApi;
};

export function AssignTemplateForm({ assign }: Props) {
    const {
        clients,
        loadingClients,
        selectedIds,
        toggleClient,
        overrides,
        templateExercises,
        adjustingClient,
        startAdjusting,
        stopAdjusting,
        saveOverride,
        restoreTemplate,
        date,
        setDate,
        minimumDate,
        submit,
        saving,
    } = assign;

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <SectionHeader title="Clientes activos" />
            {selectedIds.length > 0 ? (
                <Text variant="bodySmall" style={styles.hint}>
                    Puedes ajustar series, repeticiones o ejercicios para cada cliente sin cambiar la
                    plantilla.
                </Text>
            ) : null}
            {loadingClients ? (
                <ActivityIndicator style={styles.loader} />
            ) : clients.length === 0 ? (
                <Text variant="bodyMedium" style={styles.empty}>
                    No tienes clientes activos todavía.
                </Text>
            ) : (
                clients.map((client) => {
                    const selected = selectedIds.includes(client.id);
                    const customized = Boolean(overrides[client.id]);

                    return (
                        <View key={client.id}>
                            <SelectRow
                                title={client.name}
                                subtitle={customized ? 'Ejercicios ajustados' : undefined}
                                selected={selected}
                                onPress={() => toggleClient(client.id)}
                            />
                            {selected ? (
                                <Button
                                    icon="tune-variant"
                                    compact
                                    onPress={() => startAdjusting(client.id)}
                                    style={styles.adjust}
                                >
                                    {customized ? 'Editar ajuste' : 'Ajustar ejercicios'}
                                </Button>
                            ) : null}
                        </View>
                    );
                })
            )}

            <View style={styles.dateSection}>
                <SectionHeader title="Fecha" />
                <DateField value={date} onChange={setDate} minimumDate={minimumDate} />
            </View>

            <Button
                mode="contained"
                onPress={submit}
                loading={saving}
                disabled={saving || clients.length === 0}
                style={styles.submit}
            >
                Asignar rutina
            </Button>

            {adjustingClient ? (
                <AdjustExercisesModal
                    key={adjustingClient.id}
                    clientName={adjustingClient.name}
                    initial={overrides[adjustingClient.id] ?? templateExercises}
                    customized={Boolean(overrides[adjustingClient.id])}
                    onSave={saveOverride}
                    onRestore={restoreTemplate}
                    onDismiss={stopAdjusting}
                />
            ) : null}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        paddingBottom: 32,
    },
    hint: {
        color: '#666',
        marginBottom: 12,
    },
    loader: {
        marginVertical: 16,
    },
    empty: {
        color: '#999',
    },
    adjust: {
        alignSelf: 'flex-end',
        marginTop: -6,
        marginBottom: 10,
    },
    dateSection: {
        marginTop: 20,
    },
    submit: {
        marginTop: 24,
    },
});
