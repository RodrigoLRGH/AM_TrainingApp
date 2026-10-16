import { ScrollView, View, StyleSheet } from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';
import { useDashboard } from '../../features/stats/useDashboard';
import { PeriodSelector } from '../../components/PeriodSelector';
import { StatCard } from '../../components/StatCard';

export default function StatsScreen() {
  const { stats, loading, days, setDays } = useDashboard();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <PeriodSelector days={days} onChange={setDays} />

      {loading || !stats ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <View style={styles.grid}>
          <StatCard
            label="Clientes activos"
            value={String(stats.clients.active)}
            hint={`de ${stats.clients.total} en total`}
          />
          <StatCard
            label="Asistencia promedio"
            value={`${stats.attendanceRatePercent}%`}
            hint="Si todos vinieran cada día = 100%"
          />
          <StatCard label="Rutinas asignadas" value={String(stats.routinesAssigned)} />
          <StatCard label="Plantillas creadas" value={String(stats.templatesCreated)} />
        </View>
      )}

      <Text variant="bodySmall" style={styles.footnote}>
        Los números cuentan lo registrado en los últimos {days} días.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  center: {
    paddingVertical: 48,
    alignItems: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  footnote: {
    color: '#999',
    textAlign: 'center',
  },
});