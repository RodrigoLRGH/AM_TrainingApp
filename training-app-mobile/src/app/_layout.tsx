import { Stack } from 'expo-router';
import { PaperProvider } from 'react-native-paper';
import { theme } from '../theme/theme';

export default function RootLayout() {
  return (
    <PaperProvider theme={theme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(instructor)" />
        <Stack.Screen name="(client)" />
        <Stack.Screen
          name="client-detail/[id]"
          options={{ headerShown: true, title: 'Cliente', headerTransparent: false }} />
        <Stack.Screen
          name="new-template"
          options={{ headerShown: true, headerTransparent: false, title: 'Nueva plantilla' }}
        />
        <Stack.Screen
          name="assign-template/[id]"
          options={{ headerShown: true, headerTransparent: false, title: 'Asignar rutina' }}
        />
        <Stack.Screen
          name="routine-detail/[id]"
          options={{ headerShown: true, headerTransparent: false, title: 'Detalle de rutina' }}
        />
      </Stack>
    </PaperProvider>
  );
}