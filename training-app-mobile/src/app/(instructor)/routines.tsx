import { View, FlatList, StyleSheet } from 'react-native';
import { Text, Button, ActivityIndicator, Icon } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useTemplates } from '../../features/routines/useTemplates';
import { TemplateCard } from '../../components/TemplateCard';
import { SectionHeader } from '../../components/SectionHeader';
import type { Template } from '../../api/types';

export default function RoutinesScreen() {
  const router = useRouter();
  const { templates, loading, confirmDelete } = useTemplates();

  function openAssign(template: Template) {
    router.push({
      pathname: '/assign-template/[id]',
      params: { id: template.id, title: template.title },
    });
  }

  function openEdit(template: Template) {
    router.push({
      pathname: '/edit-template/[id]',
      params: { id: template.id },
    });
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
          <View style={styles.emptyBox}>
            <Icon source="clipboard-text-outline" size={48} color="#9AA7A0" />
            <Text variant="bodyLarge" style={styles.empty}>
              Todavía no tienes plantillas.
            </Text>
            <Text variant="bodySmall" style={styles.emptyHint}>
              Crea la primera con el botón de abajo.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <TemplateCard
            template={item}
            onAssign={openAssign}
            onEdit={openEdit}
            onDelete={confirmDelete}
          />
        )}
      />

      <View style={styles.footer}>
        <Button mode="contained" icon="plus" onPress={() => router.push('/new-template')}>
          Nueva plantilla
        </Button>
      </View>
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
  emptyBox: {
    alignItems: 'center',
    marginTop: 48,
  },
  empty: {
    marginTop: 12,
    color: '#444',
  },
  emptyHint: {
    marginTop: 4,
    color: '#999',
  },
  footer: {
    padding: 16,
  },
});