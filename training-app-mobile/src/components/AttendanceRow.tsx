import { View, StyleSheet } from 'react-native';
import { Text, Icon, useTheme } from 'react-native-paper';
import type { AttendanceRecord } from '../api/types';
import { ClientAvatar } from './ClientAvatar';

type Props = {
    record: AttendanceRecord;
};

export function AttendanceRow({ record }: Props) {
    const { colors } = useTheme();

    const time = new Date(record.date).toLocaleTimeString('es-MX', {
        hour: '2-digit',
        minute: '2-digit',
    });
    const methodLabel = record.method === 'QR' ? 'Código QR' : 'Ubicación';
    const icon = record.method === 'QR' ? 'qrcode-scan' : 'map-marker';

    return (
        <View
            style={[styles.row, { backgroundColor: colors.surface, borderColor: colors.outlineVariant }]}
        >
            <ClientAvatar name={record.client.name} />

            <View style={styles.info}>
                <Text variant="bodyLarge" style={styles.name}>
                    {record.client.name}
                </Text>
                <Text variant="bodySmall" style={{ color: colors.onSurfaceVariant }}>
                    {time} · {methodLabel}
                </Text>
            </View>

            <Icon source={icon} size={22} color={colors.primary} />
        </View>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 12,
        padding: 12,
        marginHorizontal: 16,
        marginTop: 10,
    },
    info: {
        flex: 1,
        marginHorizontal: 12,
    },
    name: {
        fontWeight: '600',
    },
});