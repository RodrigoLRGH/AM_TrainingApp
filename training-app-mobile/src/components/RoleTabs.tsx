import { View, Text, Pressable, StyleSheet } from 'react-native';
import type { LoginMode } from '../features/auth/useLogin';

type Props = {
    mode: LoginMode;
    onChange: (mode: LoginMode) => void;
};

export function RoleTabs({ mode, onChange }: Props) {
    return (
        <View style={styles.tabs}>
            <Pressable
                style={[styles.tab, mode === 'client' && styles.tabActive]}
                onPress={() => onChange('client')}
            >
                <Text style={mode === 'client' ? styles.tabTextActive : styles.tabText}>Cliente</Text>
            </Pressable>
            <Pressable
                style={[styles.tab, mode === 'instructor' && styles.tabActive]}
                onPress={() => onChange('instructor')}
            >
                <Text style={mode === 'instructor' ? styles.tabTextActive : styles.tabText}>
                    Instructor
                </Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    tabs: {
        flexDirection: 'row',
        marginBottom: 24,
    },
    tab: {
        flex: 1,
        padding: 12,
        alignItems: 'center',
        borderBottomWidth: 2,
        borderBottomColor: '#ddd',
    },
    tabActive: {
        borderBottomColor: '#2E5D4F',
    },
    tabText: {
        color: '#888',
    },
    tabTextActive: {
        color: '#2E5D4F',
        fontWeight: 'bold',
    },
});