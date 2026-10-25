import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';

type Props = {
    roleLabel: string;
    onLogout: () => void;
};

export function ProfileView({ roleLabel, onLogout }: Props) {
    return (
        <View style={styles.container}>
            <Text variant="titleLarge" style={styles.title}>
                Mi perfil
            </Text>
            <Text variant="bodyLarge" style={styles.role}>
                Sesión iniciada como {roleLabel}
            </Text>
            <Button mode="outlined" icon="logout" onPress={onLogout}>
                Cerrar sesión
            </Button>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 24,
    },
    title: {
        textAlign: 'center',
        marginBottom: 8,
    },
    role: {
        textAlign: 'center',
        marginBottom: 32,
    },
});