import { View, StyleSheet } from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';
import { useMyRoutines } from '../../features/routines/useMyRoutines';
import { RoutineCard } from '../../components/RoutineCard';

export default function RoutineScreen() {
  const { routines, loading, completed, toggleExercise } = useMyRoutines();

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
      {routines.map((routine) => (
        <RoutineCard
          key={routine.id}
          routine={routine}
          completed={completed}
          onToggleExercise={toggleExercise}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});