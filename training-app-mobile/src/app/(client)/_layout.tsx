import { Tabs } from 'expo-router';

export default function ClientLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="routine" options={{ title: 'Mi Rutina' }} />
      <Tabs.Screen name="running" options={{ title: 'Rutas' }} />
      <Tabs.Screen name="progress" options={{ title: 'Progreso' }} />
    </Tabs>
  );
}