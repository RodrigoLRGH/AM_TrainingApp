import { View, FlatList, StyleSheet } from 'react-native';
import { Text, Button, ActivityIndicator } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useTemplates } from '../../features/routines/useTemplates';
import { TemplateCard } from '../../components/TemplateCard';
import type { Template } from '../../api/types';

export default function RoutinesScreen() {
  const router = useRouter();
  const { templates, loading } = useTemplates();

  function openAssign(template: Template) {
    router.push({
      pathname: '/assign-template/[id]',
      params: { id: template.id, title: template.title },
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
          <Text variant="bodyLarge" style={styles.empty}>
            Todavía no tienes plantillas. Crea la primera con el botón de abajo.
          </Text>
        }
        renderItem={({ item }) => <TemplateCard template={item} onAssign={openAssign} />}
      />

      <View style={styles.footer}>
        <Button mode="contained" onPress={() => router.push('/new-template')}>
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
  empty: {
    textAlign: 'center',
    marginTop: 32,
    color: '#999',
  },
  footer: {
    padding: 16,
  },
});