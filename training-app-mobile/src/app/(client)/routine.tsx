import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';
import { useMyRoutines } from '../../features/routines/useMyRoutines';
import { useRateSession } from '../../features/ratings/useRateSession';
import { RoutineCard } from '../../components/RoutineCard';
import { RateSessionModal } from '../../components/RateSessionModal';

export default function RoutineScreen() {
  const { routines, loading, completed, toggleExercise } = useMyRoutines();
  const rating = useRateSession();

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (routines.length === 0) {
    return (
      <View style={styles.center}>
        <Text variant="bodyLarge">No tienes rutinas asignadas todavía.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.list}>
        {routines.map((routine) => (
          <RoutineCard
            key={routine.id}
            routine={routine}
            completed={completed}
            onToggleExercise={toggleExercise}
            rated={rating.ratedIds.includes(routine.id)}
            onRate={rating.open}
          />
        ))}
      </ScrollView>

      <RateSessionModal
        visible={rating.routine !== null}
        routineTitle={rating.routine?.title ?? ''}
        onDismiss={rating.close}
        effort={rating.effort}
        onEffortChange={rating.setEffort}
        note={rating.note}
        onNoteChange={rating.setNote}
        onSubmit={rating.submit}
        saving={rating.saving}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    padding: 16,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});