import { View, FlatList, StyleSheet } from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';
import { useRouter } from 'expo-router';
import type { Routine } from '../../api/types';
import { useMyRoutines } from '../../features/routines/useMyRoutines';
import { RoutineSummaryCard } from '../../components/RoutineSummaryCard';
import { SyncBanner } from '../../components/SyncBanner';

export default function RoutineScreen() {
  const router = useRouter();
  const { routines, loading, failed, fromCache } = useMyRoutines();

  function openRoutine(routine: Routine) {
    router.push({
      pathname: '/routine-detail/[id]',
      params: { id: routine.id, title: routine.title },
    });
  }

  function renderBody() {
    if (loading) {
      return (
        <View style={styles.center}>
          <ActivityIndicator size="large" />
        </View>
      );
    }

    if (failed) {
      return (
        <View style={styles.center}>
          <Text variant="bodyLarge" style={styles.message}>
            No pudimos cargar tus rutinas.
          </Text>
          <Text variant="bodySmall" style={styles.hint}>
            Conéctate a internet al menos una vez para guardarlas en tu teléfono.
          </Text>
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

  return (
    <View style={styles.container}>
      <SyncBanner fromCache={fromCache} />
      {renderBody()}
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
    padding: 24,
  },
  message: {
    textAlign: 'center',
    marginBottom: 4,
  },
  hint: {
    textAlign: 'center',
    color: '#999',
  },
  list: {
    padding: 16,
  },
});