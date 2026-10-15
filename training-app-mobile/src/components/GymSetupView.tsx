import { ScrollView, View, StyleSheet } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { useGymSetup } from '../features/attendance/useGymSetup';
import { GymLocationCard } from './GymLocationCard';
import { GymQrCard } from './GymQrCard';

export function GymSetupView() {
    const { config, loading, radius, setRadius, saving, saveCurrentLocation, generateQr } =
        useGymSetup();

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <GymLocationCard
                config={config}
                radius={radius}
                onRadiusChange={setRadius}
                onSave={saveCurrentLocation}
                saving={saving}
            />
            <GymQrCard qrCode={config?.gymQrCode ?? null} onGenerate={generateQr} saving={saving} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    center: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});