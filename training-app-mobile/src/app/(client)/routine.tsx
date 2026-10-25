import { View, FlatList, StyleSheet } from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useMyRoutines } from '../../features/routines/useMyRoutines';
import { RoutineSummaryCard } from '../../components/RoutineSummaryCard';
import type { Routine } from '../../api/types';

export default function RoutineScreen() {
  const router = useRouter();
  const { routines, loading } = useMyRoutines();

  function openRoutine(routine: Routine) {
    router.push({
      pathname: '/routine-detail/[id]',
      params: { id: routine.id, title: routine.title },
    });
  }

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
    <FlatList
      data={routines}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => (
        <RoutineSummaryCard routine={item} onPress={() => openRoutine(item)} />
      )}
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
});