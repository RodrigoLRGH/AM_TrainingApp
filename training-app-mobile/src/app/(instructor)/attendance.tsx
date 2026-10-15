import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { SegmentedButtons } from 'react-native-paper';
import { AttendanceHistoryView } from '../../components/AttendanceHistoryView';
import { GymSetupView } from '../../components/GymSetupView';

type Tab = 'records' | 'gym';

export default function AttendanceScreen() {
    const [tab, setTab] = useState<Tab>('records');

    function handleChange(value: string) {
        if (value === 'records' || value === 'gym') {
            setTab(value);
        }
    }

    return (
        <View style={styles.container}>
            <SegmentedButtons
                value={tab}
                onValueChange={handleChange}
                buttons={[
                    { value: 'records', label: 'Registros' },
                    { value: 'gym', label: 'Gimnasio' },
                ]}
                style={styles.tabs}
            />

            {tab === 'records' ? <AttendanceHistoryView /> : <GymSetupView />}
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