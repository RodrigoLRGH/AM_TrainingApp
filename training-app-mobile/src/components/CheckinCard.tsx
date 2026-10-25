import { StyleSheet } from 'react-native';
import { Card, Text, Button } from 'react-native-paper';

type Props = {
    onCheckinLocation: () => void;
    onScanQr: () => void;
    busy: boolean;
};

export function CheckinCard({ onCheckinLocation, onScanQr, busy }: Props) {
    return (
        <Card style={styles.card}>
            <Card.Title title="Registrar asistencia" />
            <Card.Content>
                <Text variant="bodyMedium" style={styles.hint}>
                    Usa tu ubicación si estás en el gimnasio, o escanea el código QR de la entrada.
                </Text>
                <Button
                    mode="contained"
                    icon="map-marker"
                    onPress={onCheckinLocation}
                    loading={busy}
                    disabled={busy}
                    style={styles.button}
                >
                    Registrar con mi ubicación
                </Button>
                <Button mode="outlined" icon="qrcode-scan" onPress={onScanQr} disabled={busy}>
                    Escanear código QR
                </Button>
            </Card.Content>
        </Card>
    );
}

const styles = StyleSheet.create({
    card: {
        margin: 16,
    },
    hint: {
        marginBottom: 16,
    },
    button: {
        marginBottom: 12,
    },
});