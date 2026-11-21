import { StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

type Props = {
    label: string;
    value: string;
    hint?: string;
};

// Se usa una View en lugar del Card de Paper: el Card tiene dos capas (sombra y contenido)
// y, cuando la fila estira la tarjeta a la altura de su vecina, solo se estira la capa de
// la sombra y se ve una tarjeta encima de otra. Con una sola View, ambas quedan iguales.
export function StatCard({ label, value, hint }: Props) {
    const { colors } = useTheme();

    return (
        <View style={[styles.card, { backgroundColor: colors.elevation.level1 }]}>
            <Text variant="bodyMedium" style={{ color: colors.onSurfaceVariant }}>
                {label}
            </Text>
            <Text variant="headlineMedium" style={styles.value}>
                {value}
            </Text>
            {hint ? (
                <Text variant="bodySmall" style={{ color: colors.outline }}>
                    {hint}
                </Text>
            ) : null}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        width: '48%',
        marginBottom: 16,
        padding: 16,
        borderRadius: 12,
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.15)',
    },
    value: {
        fontWeight: 'bold',
        marginVertical: 4,
    },
});
