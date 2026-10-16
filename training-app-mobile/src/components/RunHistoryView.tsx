import { View, FlatList, StyleSheet } from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';
import { useRunHistory } from '../features/running/useRunHistory';
import { RunCard } from './RunCard';
import { RunDetailModal } from './RunDetailModal';

export function RunHistoryView() {
    const { runs, loading, selected, openRun, closeRun } = useRunHistory();

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={runs}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
                ListEmptyComponent={
                    <Text variant="bodyLarge" style={styles.empty}>
                        Todavía no tienes corridas registradas.
                    </Text>
                }
                renderItem={({ item }) => <RunCard run={item} onPress={openRun} />}
            />

            <RunDetailModal run={selected} onDismiss={closeRun} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    center: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    list: {
        padding: 16,
    },
    empty: {
        textAlign: 'center',
        marginTop: 32,
        color: '#999',
    },
});