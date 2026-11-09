import { View, FlatList, StyleSheet } from 'react-native';
import { Text, ActivityIndicator, Card, Button, useTheme } from 'react-native-paper';
import { useClientRoutines } from '../features/routines/useClientRoutines';
import { RoutineDateBadge } from './RoutineDateBadge';

type Props = {
    clientId: string;
};

export function ClientRoutinesView({ clientId }: Props) {
    const { routines, loading, edit, confirmDelete } = useClientRoutines(clientId);
    const { colors } = useTheme();

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <FlatList
            data={routines}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            ListEmptyComponent={
                <Text variant="bodyLarge" style={styles.empty}>
                    Este cliente todavía no tiene rutinas asignadas.
                </Text>
            }
            renderItem={({ item }) => {
                const count = item.exercises.length;
                const done = item.exercises.filter((exercise) => exercise.completed).length;

                return (
                    <Card mode="outlined" style={styles.card}>
                        <Card.Title title={item.title} titleVariant="titleMedium" />
                        <Card.Content style={styles.content}>
                            <RoutineDateBadge date={item.date} />
                            <Text variant="bodyMedium" style={{ color: colors.onSurfaceVariant }}>
                                {done}/{count} {count === 1 ? 'ejercicio' : 'ejercicios'}
                            </Text>
                        </Card.Content>
                        <Card.Actions>
                            <Button
                                icon="delete"
                                textColor={colors.error}
                                onPress={() => confirmDelete(item)}
                            >
                                Eliminar
                            </Button>
                            <Button icon="pencil" mode="contained-tonal" onPress={() => edit(item)}>
                                Editar
                            </Button>
                        </Card.Actions>
                    </Card>
                );
            }}
        />
    );
}

const styles = StyleSheet.create({
    center: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    list: {
        padding: 16,
    },
    card: {
        marginBottom: 12,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    empty: {
        textAlign: 'center',
        marginTop: 32,
        color: '#999',
    },
});
