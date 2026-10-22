import { View, FlatList, StyleSheet } from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';
import { useClientRatings } from '../features/ratings/useClientRatings';
import { RatingRow } from './RatingRow';
import { RatingsSummary } from './RatingsSummary';

type Props = {
    clientId: string;
};

export function ClientRatingsView({ clientId }: Props) {
    const { ratings, loading, average } = useClientRatings(clientId);

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
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
    empty: {
        textAlign: 'center',
        marginTop: 32,
        color: '#999',
    },
});