import { View, FlatList, StyleSheet } from 'react-native';
import { Text, Button, ActivityIndicator } from 'react-native-paper';
import { useTemplates } from '../../features/routines/useTemplates';
import { useAssignTemplate } from '../../features/routines/useAssignTemplate';
import { TemplateCard } from '../../components/TemplateCard';
import { NewTemplateModal } from '../../components/NewTemplateModal';
import { AssignTemplateModal } from '../../components/AssignTemplateModal';

export default function RoutinesScreen() {
  const {
    templates,
    loading,
    modalVisible,
    setModalVisible,
    title,
    setTitle,
    exercises,
    addExerciseField,
    updateExercise,
    removeExercise,
    saving,
    handleCreate,
  } = useTemplates();

  const assign = useAssignTemplate();

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
        renderItem={({ item }) => <TemplateCard template={item} onAssign={assign.open} />}
      />

      <View style={styles.footer}>
        <Button mode="contained" onPress={() => setModalVisible(true)}>
          Nueva plantilla
        </Button>
      </View>

      <NewTemplateModal
        visible={modalVisible}
        onDismiss={() => setModalVisible(false)}
        title={title}
        onTitleChange={setTitle}
        exercises={exercises}
        onExerciseChange={updateExercise}
        onExerciseRemove={removeExercise}
        onAddExercise={addExerciseField}
        onSubmit={handleCreate}
        saving={saving}
      />

      <AssignTemplateModal
        visible={assign.template !== null}
        templateTitle={assign.template?.title ?? ''}
        onDismiss={assign.close}
        clients={assign.clients}
        loadingClients={assign.loadingClients}
        selectedIds={assign.selectedIds}
        onToggleClient={assign.toggleClient}
        date={assign.date}
        onDateChange={assign.setDate}
        onSubmit={assign.submit}
        saving={assign.saving}
      />
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
  footer: {
    padding: 16,
  },
});