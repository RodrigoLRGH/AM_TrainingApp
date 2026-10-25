import { View, StyleSheet } from 'react-native';
import { IconButton } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { LogoutButton } from './LogoutButton';

export function HeaderActions() {
    const router = useRouter();

    return (
        <View style={styles.row}>
            <IconButton
                icon="bell-outline"
                onPress={() => router.push('/announcements')}
                accessibilityLabel="Avisos"
            />
            <LogoutButton />
        </View>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});