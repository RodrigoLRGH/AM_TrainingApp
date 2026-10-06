import { View, FlatList, StyleSheet } from 'react-native';
import { Text, Button, ActivityIndicator } from 'react-native-paper';
import { useClients } from '../../features/clients/useClients';
import { ClientCard } from '../../components/ClientCard';
import { NewClientModal } from '../../components/NewClientModal';

export default function ClientsScreen() {
  const {
    clients,
    loading,
    modalVisible,
    setModalVisible,
    newName,
    setNewName,
    saving,
    handleCreate,
  } = useClients();

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
        data={clients}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text variant="bodyLarge" style={styles.empty}>
            Todavía no tienes clientes. Crea el primero con el botón de abajo.
          </Text>
        }
        renderItem={({ item }) => <ClientCard client={item} />}
      />

      <View style={styles.footer}>
        <Button mode="contained" onPress={() => setModalVisible(true)}>
          Nuevo cliente
        </Button>
      </View>

      <NewClientModal
        visible={modalVisible}
        onDismiss={() => setModalVisible(false)}
        name={newName}
        onNameChange={setNewName}
        onSubmit={handleCreate}
        saving={saving}
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