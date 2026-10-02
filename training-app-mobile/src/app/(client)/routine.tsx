import { View, Text, StyleSheet } from 'react-native';

export default function RoutineScreen() {
  return (
    <View style={styles.container}>
      <Text>Pantalla Mi Rutina (cliente)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});