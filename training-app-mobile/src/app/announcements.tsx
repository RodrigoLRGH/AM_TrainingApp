import { View, FlatList, StyleSheet } from 'react-native';
import { Text, Button, ActivityIndicator, Icon, useTheme } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useAuth } from '../auth/AuthContext';
import { useAnnouncements } from '../features/announcements/useAnnouncements';
import { AnnouncementCard } from '../components/AnnouncementCard';

export default function AnnouncementsScreen() {
    const router = useRouter();
    const { colors } = useTheme();
    const { session } = useAuth();
    const isInstructor = session?.role === 'INSTRUCTOR';
    const { announcements, loading, refreshing, refresh } = useAnnouncements(isInstructor);

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={announcements}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
                refreshing={refreshing}
                onRefresh={refresh}
                ListEmptyComponent={
                    <View style={styles.emptyBox}>
                        <Icon source="bell-outline" size={48} color={colors.outline} />
                        <Text variant="bodyLarge" style={styles.empty}>
                            Todavía no hay avisos.
                        </Text>
                        {isInstructor ? (
                            <Text variant="bodySmall" style={{ color: colors.onSurfaceVariant }}>
                                Publica el primero con el botón de abajo.
                            </Text>
                        ) : null}
                    </View>
                }
                renderItem={({ item }) => <AnnouncementCard announcement={item} />}
            />

            {isInstructor ? (
                <View style={styles.footer}>
                    <Button mode="contained" icon="send" onPress={() => router.push('/new-announcement')}>
                        Nuevo aviso
                    </Button>
                </View>
            ) : null}
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
        padding: 16,
    },
    emptyBox: {
        alignItems: 'center',
        marginTop: 48,
    },
    empty: {
        marginTop: 12,
        marginBottom: 4,
    },
    footer: {
        padding: 16,
    },
});