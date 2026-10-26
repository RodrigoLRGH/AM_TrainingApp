import { View, StyleSheet } from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useRoutineDetail } from '../../features/routines/useRoutineDetail';
import { useRateSession } from '../../features/ratings/useRateSession';
import { RoutineDetailView } from '../../components/RoutineDetailView';
import { RateSessionModal } from '../../components/RateSessionModal';
import { SyncBanner } from '../../components/SyncBanner';

export default function RoutineDetailScreen() {
    const { id, title } = useLocalSearchParams<{ id: string; title: string }>();
    const { routine, loading, rated, fromCache, toggleExercise } = useRoutineDetail(id);
    const rating = useRateSession(id, rated);

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ title }} />
            <SyncBanner fromCache={fromCache} />

            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" />
                </View>
            ) : !routine ? (
                <View style={styles.center}>
                    <Text variant="bodyLarge">No encontramos esta rutina.</Text>
                </View>
            ) : (
                <>
                    <RoutineDetailView
                        routine={routine}
                        onToggleExercise={toggleExercise}
                        rated={rating.rated}
                        onRate={rating.open}
                    />

                    <RateSessionModal
                        visible={rating.visible}
                        routineTitle={routine.title}
                        onDismiss={rating.close}
                        effort={rating.effort}
                        onEffortChange={rating.setEffort}
                        note={rating.note}
                        onNoteChange={rating.setNote}
                        onSubmit={rating.submit}
                        saving={rating.saving}
                    />
                </>
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
});