import { View, StyleSheet } from 'react-native';
import { Icon, Text, useTheme } from 'react-native-paper';
import { useSync } from '../offline/SyncContext';

function changesLabel(count: number) {
    return `${count} ${count === 1 ? 'cambio' : 'cambios'}`;
}

type Props = {
    fromCache?: boolean;
};

export function SyncBanner({ fromCache = false }: Props) {
    const { online, pending, failing } = useSync();
    const { colors } = useTheme();

    let message: string | null = null;
    let icon = 'cloud-off-outline';

    if (!online) {
        message =
            pending > 0
                ? `Sin conexión. ${changesLabel(pending)} se enviarán al volver la señal.`
                : 'Sin conexión. Tus cambios se guardarán y se enviarán al volver la señal.';
    } else if (failing && pending > 0) {
        icon = 'sync-alert';
        message = `No hay respuesta del servidor. ${changesLabel(pending)} se reintentarán solos.`;
    } else if (fromCache) {
        icon = 'information-outline';
        message = 'No se pudo actualizar. Estás viendo tu última rutina guardada.';
    }

    if (!message) {
        return null;
    }

    return (
        <View style={[styles.banner, { backgroundColor: colors.secondaryContainer }]}>
            <Icon source={icon} size={20} color={colors.onSecondaryContainer} />
            <Text variant="bodySmall" style={[styles.text, { color: colors.onSecondaryContainer }]}>
                {message}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    banner: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
    },
    text: {
        flex: 1,
        marginLeft: 10,
    },
});