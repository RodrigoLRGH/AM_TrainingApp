import { View, StyleSheet } from 'react-native';
import { Button, Icon, Text, useTheme } from 'react-native-paper';

type Props = {
    message: string;
    onRetry: () => void;
};

/** Estado de una pantalla cuyos datos no se pudieron cargar (p. ej. sin internet). */
export function LoadErrorState({ message, onRetry }: Props) {
    const { colors } = useTheme();

    return (
        <View style={styles.container}>
            <Icon source="cloud-off-outline" size={48} color={colors.outline} />
            <Text variant="bodyLarge" style={[styles.message, { color: colors.onSurfaceVariant }]}>
                {message}
            </Text>
            <Button mode="outlined" icon="refresh" onPress={onRetry}>
                Reintentar
            </Button>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginTop: 48,
        paddingHorizontal: 24,
        gap: 16,
    },
    message: {
        textAlign: 'center',
    },
});
