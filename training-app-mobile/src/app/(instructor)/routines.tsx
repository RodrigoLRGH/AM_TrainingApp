import { View, Text, StyleSheet } from 'react-native';

export default function RoutinesScreen() {
  return (
    <View style={styles.container}>
      <Text>Pantalla de Rutinas (instructor)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});