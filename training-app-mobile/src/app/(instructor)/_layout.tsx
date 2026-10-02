import { Tabs } from 'expo-router';

export default function InstructorLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="clients" options={{ title: 'Clientes' }} />
      <Tabs.Screen name="routines" options={{ title: 'Rutinas' }} />
      <Tabs.Screen name="stats" options={{ title: 'Estadísticas' }} />
    </Tabs>
  );
}