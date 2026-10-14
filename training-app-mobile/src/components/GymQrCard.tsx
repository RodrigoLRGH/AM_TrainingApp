import { View, StyleSheet } from 'react-native';
import { Card, Text, Button } from 'react-native-paper';
import QRCode from 'react-native-qrcode-svg';

type Props = {
    qrCode: string | null;
    onGenerate: () => void;
    saving: boolean;
};

export function GymQrCard({ qrCode, onGenerate, saving }: Props) {
    return (
        <Card style={styles.card}>
            <Card.Title title="Código QR del gimnasio" />
            <Card.Content>
                {qrCode ? (
                    <View style={styles.qrContainer}>
                        <QRCode value={qrCode} size={200} />
                        <Text variant="bodySmall" style={styles.hint}>
                            Imprímelo y pégalo en la entrada. Si generas uno nuevo, el anterior deja de funcionar.
                        </Text>
                    </View>
                ) : (
                    <Text variant="bodyMedium" style={styles.hint}>
                        Todavía no has generado un código QR.
                    </Text>
                )}
            </Card.Content>
            <Card.Actions>
                <Button mode="contained" onPress={onGenerate} loading={saving} disabled={saving}>
                    {qrCode ? 'Generar uno nuevo' : 'Generar QR'}
                </Button>
            </Card.Actions>
        </Card>
    );
}

const styles = StyleSheet.create({
    card: {
        marginBottom: 16,
    },
    qrContainer: {
        alignItems: 'center',
    },
    hint: {
        marginTop: 12,
        color: '#666',
        textAlign: 'center',
    },
});