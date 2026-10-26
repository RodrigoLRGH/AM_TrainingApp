import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, IconButton, Menu, useTheme } from 'react-native-paper';
import type { Client } from '../api/types';
import { ClientAvatar } from './ClientAvatar';

type Props = {
    client: Client;
    onOpen: (client: Client) => void;
    onToggleActive: (client: Client) => void;
};

export function ClientCard({ client, onOpen, onToggleActive }: Props) {
    const { colors } = useTheme();
    const [menuVisible, setMenuVisible] = useState(false);

    const accentBackground = client.active ? colors.secondaryContainer : colors.surfaceVariant;
    const accentText = client.active ? colors.onSecondaryContainer : colors.onSurfaceVariant;

    function toggle() {
        setMenuVisible(false);
        onToggleActive(client);
    }

    return (
        <Card style={styles.card} onPress={() => onOpen(client)}>
            <View style={styles.row}>
                <ClientAvatar
                    name={client.name}
                    backgroundColor={accentBackground}
                    textColor={accentText}
                />

                <View style={styles.info}>
                    <Text variant="titleMedium" style={styles.name}>
                        {client.name}
                    </Text>

                    <View style={styles.tags}>
                        <View
                            style={[
                                styles.codeTag,
                                { backgroundColor: colors.surface, borderColor: colors.outlineVariant },
                            ]}
                        >
                            <Text
                                variant="labelSmall"
                                style={[styles.codeLabel, { color: colors.onSurfaceVariant }]}
                            >
                                CÓDIGO
                            </Text>
                            <Text variant="labelLarge" style={[styles.code, { color: colors.primary }]}>
                                {client.clientCode}
                            </Text>
                        </View>

                        <View style={[styles.status, { backgroundColor: accentBackground }]}>
                            <Text variant="labelMedium" style={[styles.statusText, { color: accentText }]}>
                                {client.active ? 'Activo' : 'Inactivo'}
                            </Text>
                        </View>
                    </View>
                </View>

                <Menu
                    visible={menuVisible}
                    onDismiss={() => setMenuVisible(false)}
                    anchorPosition="bottom"
                    anchor={
                        <IconButton
                            icon="dots-vertical"
                            onPress={() => setMenuVisible(true)}
                            accessibilityLabel="Opciones del cliente"
                        />
                    }
                >
                    <Menu.Item
                        leadingIcon={client.active ? 'account-off' : 'account-check'}
                        title={client.active ? 'Desactivar' : 'Activar'}
                        titleStyle={client.active ? { color: colors.error } : undefined}
                        onPress={toggle}
                    />
                </Menu>
            </View>
        </Card>
    );
}

const styles = StyleSheet.create({
    card: {
        marginBottom: 12,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingLeft: 14,
        paddingRight: 4,
    },
    info: {
        flex: 1,
        marginHorizontal: 12,
    },
    name: {
        fontWeight: '700',
    },
    tags: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        marginTop: 6,
    },
    codeTag: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: 3,
        marginRight: 8,
    },
    codeLabel: {
        letterSpacing: 0.5,
        marginRight: 6,
    },
    code: {
        fontWeight: '700',
        letterSpacing: 1.5,
    },
    status: {
        borderRadius: 12,
        paddingHorizontal: 10,
        paddingVertical: 3,
    },
    statusText: {
        fontWeight: '600',
    },
});