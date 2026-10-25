import { Stack } from 'expo-router';
import { PaperProvider } from 'react-native-paper';
import { theme } from '../theme/theme';
import { AuthProvider } from '../auth/AuthContext';

const detailOptions = {
  headerShown: true,
  headerTransparent: false,
};

export default function RootLayout() {
  return (
    <PaperProvider theme={theme}>
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(instructor)" />
          <Stack.Screen name="(client)" />
          <Stack.Screen name="client-detail/[id]" options={{ ...detailOptions, title: 'Cliente' }} />
          <Stack.Screen name="new-template" options={{ ...detailOptions, title: 'Nueva plantilla' }} />
          <Stack.Screen
            name="edit-template/[id]"
            options={{ ...detailOptions, title: 'Editar plantilla' }}
          />
          <Stack.Screen
            name="assign-template/[id]"
            options={{ ...detailOptions, title: 'Asignar rutina' }}
          />
          <Stack.Screen
            name="routine-detail/[id]"
            options={{ ...detailOptions, title: 'Detalle de rutina' }}
          />
        </Stack>
      </AuthProvider>
    </PaperProvider>
  );
}