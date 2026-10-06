import { View, Text, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { useLogin } from '../../features/auth/useLogin';
import { RoleTabs } from '../../components/RoleTabs';
import { LoginForm } from '../../components/LoginForm';

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

  return (
    <View style={styles.container}>
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

      <Button mode="contained" onPress={handleLogin} loading={loading} disabled={loading}>
        Entrar
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 32,
  },
});