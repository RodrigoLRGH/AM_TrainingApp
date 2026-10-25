import { View, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { CameraView } from 'expo-camera';

type Props = {
    onScanned: (qrCode: string) => void;
    onCancel: () => void;
};

export function QrScannerView({ onScanned, onCancel }: Props) {
    return (
        <View style={styles.container}>
            <CameraView
                style={styles.camera}
                facing="back"
                barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
                onBarcodeScanned={({ data }) => onScanned(data)}
            />
            <View style={styles.footer}>
                <Button mode="outlined" onPress={onCancel}>
                    Cancelar
                </Button>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    camera: {
        flex: 1,
    },
    footer: {
        padding: 16,
    },
});