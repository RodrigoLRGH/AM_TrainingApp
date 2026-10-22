import { View, FlatList, StyleSheet } from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useClientRatings } from '../../features/ratings/useClientRatings';
import { RatingRow } from '../../components/RatingRow';
import { RatingsSummary } from '../../components/RatingsSummary';

export default function ClientDetailScreen() {
    const { id, name } = useLocalSearchParams<{ id: string; name: string }>();
    const { ratings, loading, average } = useClientRatings(id);

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ title: name }} />

            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" />
                </View>
            ) : (
                <FlatList
                    data={ratings}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.list}
                    ListHeaderComponent={
                        average !== null ? <RatingsSummary average={average} count={ratings.length} /> : null
                    }
                    ListEmptyComponent={
                        <Text variant="bodyLarge" style={styles.empty}>
                            Este cliente todavía no ha calificado ninguna sesión.
                        </Text>
                    }
                    renderItem={({ item }) => <RatingRow rating={item} />}
                />
            )}
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