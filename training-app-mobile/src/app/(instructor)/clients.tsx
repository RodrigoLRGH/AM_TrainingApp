import { View, FlatList, StyleSheet } from 'react-native';
import { Text, Button, ActivityIndicator, Icon } from 'react-native-paper';
import { router } from 'expo-router';
import { useClients } from '../../features/clients/useClients';
import { ClientCard } from '../../components/ClientCard';
import { NewClientModal } from '../../components/NewClientModal';
import { SectionHeader } from '../../components/SectionHeader';
import type { Client } from '../../api/types';

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
    confirmToggle,
  } = useClients();

  function openClient(client: Client) {
    router.push({
      pathname: '/client-detail/[id]',
      params: { id: client.id, name: client.name },
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
        data={clients}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Icon source="account-group-outline" size={48} color="#9AA7A0" />
            <Text variant="bodyLarge" style={styles.empty}>
              Todavía no tienes clientes.
            </Text>
            <Text variant="bodySmall" style={styles.emptyHint}>
              Crea el primero con el botón de abajo.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <ClientCard client={item} onOpen={openClient} onToggleActive={confirmToggle} />
        )} 
      />

      <View style={styles.footer}>
        <Button mode="contained" icon="account-plus" onPress={() => setModalVisible(true)}>
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