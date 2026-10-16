import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { SegmentedButtons } from 'react-native-paper';
import { useRunTracker } from '../../features/running/useRunTracker';
import { RunTrackerView } from '../../components/RunTrackerView';
import { RunHistoryView } from '../../components/RunHistoryView';

type Tab = 'run' | 'history';

export default function RunningScreen() {
  const [tab, setTab] = useState<Tab>('run');
  const tracker = useRunTracker();

  function handleChange(value: string) {
    if (value === 'run' || value === 'history') {
      setTab(value);
    }
  }

  return (
    <View style={styles.container}>
      <SegmentedButtons
        value={tab}
        onValueChange={handleChange}
        buttons={[
          { value: 'run', label: 'Correr' },
          { value: 'history', label: 'Historial' },
        ]}
        style={styles.tabs}
      />

      {tab === 'run' ? <RunTrackerView tracker={tracker} /> : <RunHistoryView />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabs: {
    margin: 16,
  },
});