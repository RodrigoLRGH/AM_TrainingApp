import { Tabs } from 'expo-router';
import { useTheme } from 'react-native-paper';
import { HeaderActions } from '../../components/HeaderActions';
import { tabIcon } from '../../components/tabIcon';

export default function ClientLayout() {
  const { colors } = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        headerRight: () => <HeaderActions />,
      }}
    >
      <Tabs.Screen name="routine" options={{ title: 'Mi Rutina', tabBarIcon: tabIcon('dumbbell') }} />
      <Tabs.Screen
        name="attendance"
        options={{ title: 'Asistencia', tabBarIcon: tabIcon('calendar-check') }}
      />
      <Tabs.Screen name="running" options={{ title: 'Rutas', tabBarIcon: tabIcon('run') }} />
      <Tabs.Screen
        name="progress"
        options={{ title: 'Progreso', tabBarIcon: tabIcon('chart-line') }}
      />
      <Tabs.Screen name="profile" options={{ title: 'Perfil', tabBarIcon: tabIcon('account') }} />
    </Tabs>
  );
}