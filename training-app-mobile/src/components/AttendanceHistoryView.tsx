import { View, SectionList, StyleSheet } from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';
import { useAttendanceHistory } from '../features/attendance/useAttendanceHistory';
import { AttendanceRow } from './AttendanceRow';
import { ClientFilterChips } from './ClientFilterChips';

export function AttendanceHistoryView() {
    const { sections, clients, selectedClientId, setSelectedClientId, loading } =
        useAttendanceHistory();

    return (
        <View style={styles.container}>
            <ClientFilterChips
                clients={clients}
                selectedClientId={selectedClientId}
                onSelect={setSelectedClientId}
            />

            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" />
                </View>
            ) : (
                <SectionList
                    sections={sections}
                    keyExtractor={(item) => item.id}
                    renderSectionHeader={({ section }) => (
                        <Text variant="titleSmall" style={styles.sectionHeader}>
                            {section.title}
                        </Text>
                    )}
                    renderItem={({ item }) => <AttendanceRow record={item} />}
                    ListEmptyComponent={
                        <Text variant="bodyLarge" style={styles.empty}>
                            Todavía no hay asistencias registradas.
                        </Text>
                    }
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    center: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    sectionHeader: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        textTransform: 'capitalize',
        backgroundColor: '#E8F0EC',
    },
    empty: {
        textAlign: 'center',
        marginTop: 32,
        color: '#999',
    },
});