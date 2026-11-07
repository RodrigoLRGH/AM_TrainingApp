import { ScrollView, Text, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { useLogin } from '../../features/auth/useLogin';
import { RoleTabs } from '../../components/RoleTabs';
import { LoginForm } from '../../components/LoginForm';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const {
    mode,
    setMode,
    email,
    setEmail,
    password,
    setPassword,
    clientCode,
    setClientCode,
    loading,
    handleLogin,
  } = useLogin();
  const router = useRouter();

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      automaticallyAdjustKeyboardInsets
    >
      <Text style={styles.title}>Training App</Text>

      <RoleTabs mode={mode} onChange={setMode} />

      <LoginForm
        mode={mode}
        email={email}
        onEmailChange={setEmail}
        password={password}
        onPasswordChange={setPassword}
        clientCode={clientCode}
        onClientCodeChange={setClientCode}
      />

      <Button
        mode="contained"
        onPress={handleLogin}
        loading={loading}
        disabled={loading}
        style={styles.submit}
      >
        Entrar
      </Button>
      {mode === 'instructor' ? (
        <Button mode="text" onPress={() => router.push('/(auth)/register')} style={styles.link}>
          ¿No tienes cuenta? Regístrate
        </Button>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 32,
  },
  submit: {
    marginTop: 16,
  },
  link: {
    marginTop: 12,
  },
});