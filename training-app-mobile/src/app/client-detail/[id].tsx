import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { SegmentedButtons } from 'react-native-paper';
import { Stack, useLocalSearchParams } from 'expo-router';
import { ClientRatingsView } from '../../components/ClientRatingsView';
import { ClientProgressView } from '../../components/ClientProgressView';
import { ClientRoutinesView } from '../../components/ClientRoutinesView';

type Tab = 'routines' | 'ratings' | 'progress';

export default function ClientDetailScreen() {
    const { id, name } = useLocalSearchParams<{ id: string; name: string }>();
    const [tab, setTab] = useState<Tab>('routines');

    function handleChange(value: string) {
        if (value === 'routines' || value === 'ratings' || value === 'progress') {
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
                    { value: 'routines', label: 'Rutinas' },
                    { value: 'ratings', label: 'Calificaciones' },
                    { value: 'progress', label: 'Progreso' },
                ]}
                style={styles.tabs}
            />

            {tab === 'routines' ? <ClientRoutinesView clientId={id} /> : null}
            {tab === 'ratings' ? <ClientRatingsView clientId={id} /> : null}
            {tab === 'progress' ? <ClientProgressView clientId={id} /> : null}
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