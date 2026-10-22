import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { SegmentedButtons } from 'react-native-paper';
import { Stack, useLocalSearchParams } from 'expo-router';
import { ClientRatingsView } from '../../components/ClientRatingsView';
import { ClientProgressView } from '../../components/ClientProgressView';

type Tab = 'ratings' | 'progress';

export default function ClientDetailScreen() {
    const { id, name } = useLocalSearchParams<{ id: string; name: string }>();
    const [tab, setTab] = useState<Tab>('ratings');

    function handleChange(value: string) {
        if (value === 'ratings' || value === 'progress') {
            setTab(value);
        }
    }

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ title: name }} />

            <SegmentedButtons
                value={tab}
                onValueChange={handleChange}
                buttons={[
                    { value: 'ratings', label: 'Calificaciones' },
                    { value: 'progress', label: 'Progreso' },
                ]}
                style={styles.tabs}
            />

            {tab === 'ratings' ? <ClientRatingsView clientId={id} /> : <ClientProgressView clientId={id} />}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    tabs: {
        margin: 16,
    },
});