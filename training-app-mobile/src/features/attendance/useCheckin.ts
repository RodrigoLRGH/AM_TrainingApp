import { useRef, useState } from 'react';
import { AppAlert } from '../../components/AppAlert';
import * as Location from 'expo-location';
import { useCameraPermissions } from 'expo-camera';
import { checkinGeo, checkinQr } from '../../api/attendance';
import { getErrorMessage } from '../../api/errors';
import { alertPermissionDenied } from '../permissions/alertPermissionDenied';

export function useCheckin() {
    const [permission, requestPermission] = useCameraPermissions();
    const [scanning, setScanning] = useState(false);
    const [busy, setBusy] = useState(false);

    const lockRef = useRef(false);

    async function checkinWithLocation() {
        if (lockRef.current) {
            return;
        }

        lockRef.current = true;
        setBusy(true);
        try {
            const { status, canAskAgain } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                alertPermissionDenied(
                    'Necesitamos permiso de ubicación para registrar tu asistencia.',
                    canAskAgain,
                );
                return;
            }

            const position = await Location.getCurrentPositionAsync({});
            await checkinGeo({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
            });
            AppAlert.alert('Asistencia registrada');
        } catch (error) {
            AppAlert.alert(getErrorMessage(error, 'No se pudo registrar la asistencia.'));
        } finally {
            lockRef.current = false;
            setBusy(false);
        }
    }

    async function startScan() {
        if (!permission?.granted) {
            const result = await requestPermission();
            if (!result.granted) {
                alertPermissionDenied(
                    'Necesitamos permiso de la cámara para escanear el código QR.',
                    result.canAskAgain,
                );
                return;
            }
        }
        setScanning(true);
    }

    function stopScan() {
        setScanning(false);
    }

    async function handleScanned(qrCode: string) {
        if (lockRef.current) {
            return;
        }

        lockRef.current = true;
        setBusy(true);
        setScanning(false);
        try {
            await checkinQr(qrCode);
            AppAlert.alert('Asistencia registrada');
        } catch (error) {
            AppAlert.alert(getErrorMessage(error, 'No se pudo registrar la asistencia.'));
        } finally {
            lockRef.current = false;
            setBusy(false);
        }
    }

    return {
        scanning,
        busy,
        checkinWithLocation,
        startScan,
        stopScan,
        handleScanned,
    };
}