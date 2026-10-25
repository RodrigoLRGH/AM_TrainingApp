import { View, StyleSheet } from 'react-native';
import { useCheckin } from '../../features/attendance/useCheckin';
import { CheckinCard } from '../../components/CheckinCard';
import { QrScannerView } from '../../components/QrScannerView';

export default function ClientAttendanceScreen() {
    const { scanning, busy, checkinWithLocation, startScan, stopScan, handleScanned } =
        useCheckin();

    if (scanning) {
        return <QrScannerView onScanned={handleScanned} onCancel={stopScan} />;
    }

    return (
        <View style={styles.container}>
            <CheckinCard
                onCheckinLocation={checkinWithLocation}
                onScanQr={startScan}
                busy={busy}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});