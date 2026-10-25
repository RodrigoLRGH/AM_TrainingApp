import { Tabs } from 'expo-router';
import { useTheme } from 'react-native-paper';
import { LogoutButton } from '../../components/LogoutButton';
import { tabIcon } from '../../components/tabIcon';
import { HeaderActions } from '../../components/HeaderActions';

export default function InstructorLayout() {
  const { colors } = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        headerRight: () => <HeaderActions />,
      }}
    >
      <Tabs.Screen
        name="clients"
        options={{ title: 'Clientes', tabBarIcon: tabIcon('account-group') }}
      />
      <Tabs.Screen
        name="routines"
        options={{ title: 'Rutinas', tabBarIcon: tabIcon('clipboard-list') }}
      />
      <Tabs.Screen
        name="attendance"
        options={{ title: 'Asistencia', tabBarIcon: tabIcon('calendar-check') }}
      />
      <Tabs.Screen
        name="stats"
        options={{ title: 'Estadísticas', tabBarIcon: tabIcon('chart-box') }}
      />
      <Tabs.Screen name="profile" options={{ title: 'Perfil', tabBarIcon: tabIcon('account') }} />
    </Tabs>
  );
}