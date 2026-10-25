import { View, SectionList, StyleSheet } from 'react-native';
import { Text, ActivityIndicator, Icon, useTheme } from 'react-native-paper';
import { useAttendanceHistory } from '../features/attendance/useAttendanceHistory';
import { AttendanceRow } from './AttendanceRow';
import { ClientFilterChips } from './ClientFilterChips';

export function AttendanceHistoryView() {
    const { sections, clients, selectedClientId, setSelectedClientId, loading } =
        useAttendanceHistory();
    const { colors } = useTheme();
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
                    contentContainerStyle={styles.list}
                    renderSectionHeader={({ section }) => (
                        <View style={[styles.sectionHeader, { backgroundColor: colors.secondaryContainer }]}>
                            <Text
                                variant="titleSmall"
                                style={[styles.sectionTitle, { color: colors.onSecondaryContainer }]}
                            >
                                {section.title}
                            </Text>
                            <Text variant="bodySmall" style={{ color: colors.onSecondaryContainer }}>
                                {section.data.length} {section.data.length === 1 ? 'asistencia' : 'asistencias'}
                            </Text>
                        </View>
                    )}
                    renderItem={({ item }) => <AttendanceRow record={item} />}
                    ListEmptyComponent={
                        <View style={styles.emptyBox}>
                            <Icon source="calendar-blank-outline" size={48} color="#9AA7A0" />
                            <Text variant="bodyLarge" style={styles.empty}>
                                Todavía no hay asistencias registradas.
                            </Text>
                        </View>
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
    list: {
        paddingBottom: 16,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginTop: 8,
    },
    sectionTitle: {
        fontWeight: '700',
        textTransform: 'capitalize',
    },
    emptyBox: {
        alignItems: 'center',
        marginTop: 48,
    },
    empty: {
        marginTop: 12,
        color: '#444',
    },
});