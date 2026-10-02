import { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';
import { api } from '../../api/client';
import { saveSession } from '../../auth/storage';
import { Button } from 'react-native-paper';

type Mode = 'instructor' | 'client';

export default function LoginScreen() {
  const [mode, setMode] = useState<Mode>('client');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [clientCode, setClientCode] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setLoading(true);
    try {
      if (mode === 'instructor') {
        const { data } = await api.post('/auth/instructor/login', { email, password });
        await saveSession(data.accessToken, 'INSTRUCTOR');
        router.replace('/(instructor)/clients');
      } else {
        const { data } = await api.post('/auth/client/login', { clientCode });
        await saveSession(data.accessToken, 'CLIENTE');
        router.replace('/(client)/routine');
      }
    } catch (error: any) {
      const message = error.response?.data?.message ?? 'Algo salió mal, intenta de nuevo.';
      Alert.alert('Error', message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Training App</Text>

      <View style={styles.tabs}>
        <Pressable
          style={[styles.tab, mode === 'client' && styles.tabActive]}
          onPress={() => setMode('client')}
        >
          <Text style={mode === 'client' ? styles.tabTextActive : styles.tabText}>Cliente</Text>
        </Pressable>
        <Pressable
          style={[styles.tab, mode === 'instructor' && styles.tabActive]}
          onPress={() => setMode('instructor')}
        >
          <Text style={mode === 'instructor' ? styles.tabTextActive : styles.tabText}>
            Instructor
          </Text>
        </Pressable>
      </View>

      {mode === 'client' ? (
        <TextInput
          style={styles.input}
          placeholder="Código de cliente"
          value={clientCode}
          onChangeText={setClientCode}
          autoCapitalize="characters"
        />
      ) : (
        <>
          <TextInput
            style={styles.input}
            placeholder="Correo electrónico"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </>
      )}

      <Button mode="contained" onPress={handleLogin} loading={loading} disabled={loading}>
        Entrar
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24 },
  title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 32 },
  tabs: { flexDirection: 'row', marginBottom: 24 },
  tab: { flex: 1, padding: 12, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: '#ddd' },
  tabActive: { borderBottomColor: '#2E5D4F' },
  tabText: { color: '#888' },
  tabTextActive: { color: '#2E5D4F', fontWeight: 'bold' },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 14,
    marginBottom: 16,
    fontSize: 16,
  },
  button: { backgroundColor: '#2E5D4F', padding: 16, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});