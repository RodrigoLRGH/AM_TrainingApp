import { Pressable, ScrollView, StyleSheet } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import type { Client } from '../api/types';

type PillProps = {
    label: string;
    selected: boolean;
    onPress: () => void;
};

function FilterPill({ label, selected, onPress }: PillProps) {
    const { colors } = useTheme();

    return (
        <Pressable
            onPress={onPress}
            style={[
                styles.pill,
                { backgroundColor: colors.surface, borderColor: colors.outlineVariant },
                selected && { backgroundColor: colors.primary, borderColor: colors.primary },
            ]}
            accessibilityRole="button"
            accessibilityState={{ selected }}
        >
            <Text
                variant="labelLarge"
                style={{ color: selected ? colors.onPrimary : colors.onSurface, fontWeight: selected ? '600' : '400' }}
            >
                {label}
            </Text>
        </Pressable>
    );
}

type Props = {
    clients: Client[];
    selectedClientId: string | null;
    onSelect: (clientId: string | null) => void;
};

export function ClientFilterChips({ clients, selectedClientId, onSelect }: Props) {
    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.row}
        >
            <FilterPill
                label="Todos"
                selected={selectedClientId === null}
                onPress={() => onSelect(null)}
            />
            {clients.map((client) => (
                <FilterPill
                    key={client.id}
                    label={client.name}
                    selected={selectedClientId === client.id}
                    onPress={() => onSelect(client.id)}
                />
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    row: {
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    pill: {
        borderWidth: 1,
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginRight: 8,
    },
});