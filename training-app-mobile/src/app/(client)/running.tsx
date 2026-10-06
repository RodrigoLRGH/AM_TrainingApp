import { View, Text, StyleSheet } from 'react-native';

export default function RunningScreen() {
  return (
    <View style={styles.container}>
      <Text>Pantalla de Rutas (cliente)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
});