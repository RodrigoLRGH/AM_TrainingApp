import { useCallback, useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import {
  Text,
  Card,
  Button,
  Portal,
  Modal,
  TextInput,
  ActivityIndicator,
  IconButton,
} from 'react-native-paper';
import { useFocusEffect } from 'expo-router';
import { getRoutines, createRoutine } from '../../api/routines';

type Exercise = { name: string; sets: string; reps: string };
type Template = {
  id: string;
  title: string;
  exercises: { id: string; name: string; sets: number; reps: number }[];
};

export default function RoutinesScreen() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [exercises, setExercises] = useState<Exercise[]>([{ name: '', sets: '', reps: '' }]);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getRoutines(true);
      setTemplates(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  function addExerciseField() {
    setExercises((prev) => [...prev, { name: '', sets: '', reps: '' }]);
  }

  function updateExercise(index: number, field: keyof Exercise, value: string) {
    setExercises((prev) =>
      prev.map((ex, i) => (i === index ? { ...ex, [field]: value } : ex)),
    );
  }

  function removeExercise(index: number) {
    setExercises((prev) => prev.filter((_, i) => i !== index));
  }

  function resetForm() {
    setTitle('');
    setExercises([{ name: '', sets: '', reps: '' }]);
  }

  async function handleCreate() {
    const validExercises = exercises
      .filter((ex) => ex.name.trim())
      .map((ex) => ({
        name: ex.name.trim(),
        sets: Number(ex.sets) || 1,
        reps: Number(ex.reps) || 1,
      }));

    if (!title.trim() || validExercises.length === 0) return;

    setSaving(true);
    try {
      await createRoutine({ title: title.trim(), isTemplate: true, exercises: validExercises });
      resetForm();
      setModalVisible(false);
      load();
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  }

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
        data={templates}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text variant="bodyLarge" style={styles.empty}>
            Todavía no tienes plantillas. Crea la primera con el botón de abajo.
          </Text>
        }
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Card.Title title={item.title} subtitle={`${item.exercises.length} ejercicios`} />
            <Card.Content>
              {item.exercises.map((ex) => (
                <Text key={ex.id} variant="bodyMedium">
                  • {ex.name} — {ex.sets}x{ex.reps}
                </Text>
              ))}
            </Card.Content>
          </Card>
        )}
      />

      <View style={styles.footer}>
        <Button mode="contained" onPress={() => setModalVisible(true)}>
          Nueva plantilla
        </Button>
      </View>

      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={() => setModalVisible(false)}
          contentContainerStyle={styles.modal}
        >
          <Text variant="titleMedium" style={styles.modalTitle}>
            Nueva plantilla
          </Text>
          <TextInput
            label="Título de la rutina"
            value={title}
            onChangeText={setTitle}
            style={styles.input}
          />

          <Text variant="labelLarge" style={styles.sectionLabel}>
            Ejercicios
          </Text>
          {exercises.map((ex, index) => (
            <View key={index} style={styles.exerciseRow}>
              <TextInput
                label="Nombre"
                value={ex.name}
                onChangeText={(v) => updateExercise(index, 'name', v)}
                style={styles.exerciseName}
              />
              <TextInput
                label="Series"
                value={ex.sets}
                onChangeText={(v) => updateExercise(index, 'sets', v)}
                keyboardType="numeric"
                style={styles.exerciseNumber}
              />
              <TextInput
                label="Reps"
                value={ex.reps}
                onChangeText={(v) => updateExercise(index, 'reps', v)}
                keyboardType="numeric"
                style={styles.exerciseNumber}
              />
              <IconButton icon="close" onPress={() => removeExercise(index)} />
            </View>
          ))}

          <Button onPress={addExerciseField} style={styles.addButton}>
            + Agregar ejercicio
          </Button>

          <Button mode="contained" onPress={handleCreate} loading={saving} disabled={saving}>
            Guardar plantilla
          </Button>
        </Modal>
      </Portal>
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
  card: {
    marginBottom: 12,
  },
  empty: {
    textAlign: 'center',
    marginTop: 32,
    color: '#999',
  },
  footer: {
    padding: 16,
  },
  modal: {
    backgroundColor: 'white',
    padding: 24,
    margin: 24,
    borderRadius: 8,
    maxHeight: '85%',
  },
  modalTitle: {
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
  },
  sectionLabel: {
    marginBottom: 8,
  },
  exerciseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  exerciseName: {
    flex: 2,
    marginRight: 4,
  },
  exerciseNumber: {
    flex: 1,
    marginRight: 4,
  },
  addButton: {
    marginBottom: 16,
  },
});