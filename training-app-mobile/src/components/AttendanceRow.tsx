import { List } from 'react-native-paper';
import type { AttendanceRecord } from '../api/attendance';

type Props = {
    record: AttendanceRecord;
};

export function AttendanceRow({ record }: Props) {
    const time = new Date(record.date).toLocaleTimeString('es-MX', {
        hour: '2-digit',
        minute: '2-digit',
    });
    const methodLabel = record.method === 'QR' ? 'Código QR' : 'Ubicación';
    const icon = record.method === 'QR' ? 'qrcode-scan' : 'map-marker';

    return (
        <List.Item
            title={record.client.name}
            description={`${time} · ${methodLabel}`}
            left={(props) => <List.Icon {...props} icon={icon} />}
        />
    );
}