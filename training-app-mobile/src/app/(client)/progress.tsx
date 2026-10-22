import { View, ScrollView, StyleSheet } from 'react-native';
import { Button, ActivityIndicator } from 'react-native-paper';
import { useMeasurements } from '../../features/progress/useMeasurements';
import { METRICS } from '../../features/progress/metrics';
import { MetricChips } from '../../components/MetricChips';
import { ProgressCard } from '../../components/ProgressCard';
import { NewMeasurementModal } from '../../components/NewMeasurementModal';

export default function ProgressScreen() {
  const {
    loading,
    metric,
    setMetric,
    series,
    modalVisible,
    setModalVisible,
    form,
    setField,
    saving,
    submit,
  } = useMeasurements();

  const current = METRICS.find((item) => item.key === metric) ?? METRICS[0];

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        <MetricChips selected={metric} onSelect={setMetric} />
        <ProgressCard metric={current} points={series} />
      </ScrollView>

      <View style={styles.footer}>
        <Button mode="contained" onPress={() => setModalVisible(true)}>
          Registrar medición
        </Button>
      </View>

      <NewMeasurementModal
        visible={modalVisible}
        onDismiss={() => setModalVisible(false)}
        form={form}
        onChange={setField}
        onSubmit={submit}
        saving={saving}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    padding: 16,
  },
});