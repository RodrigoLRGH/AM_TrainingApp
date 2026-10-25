import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, Button, IconButton, Menu, useTheme } from 'react-native-paper';
import type { Template } from '../api/types';

const MAX_VISIBLE = 4;

type Props = {
    template: Template;
    onAssign: (template: Template) => void;
    onEdit: (template: Template) => void;
    onDelete: (template: Template) => void;
};

export function TemplateCard({ template, onAssign, onEdit, onDelete }: Props) {
    const { colors } = useTheme();
    const [menuVisible, setMenuVisible] = useState(false);

    const total = template.exercises.length;
    const visible = template.exercises.slice(0, MAX_VISIBLE);
    const hidden = total - visible.length;

    function choose(action: (template: Template) => void) {
        setMenuVisible(false);
        action(template);
    }

    return (
        <Card mode="outlined" style={styles.card}>
            <View style={[styles.banner, { backgroundColor: colors.primary }]}>
                <View style={styles.bannerText}>
                    <Text variant="titleLarge" style={[styles.title, { color: colors.onPrimary }]}>
                        {template.title}
                    </Text>
                    <Text variant="bodySmall" style={[styles.count, { color: colors.onPrimary }]}>
                        {total} {total === 1 ? 'ejercicio' : 'ejercicios'}
                    </Text>
                </View>

                <Menu
                    visible={menuVisible}
                    onDismiss={() => setMenuVisible(false)}
                    anchorPosition="bottom"
                    anchor={
                        <IconButton
                            icon="dots-vertical"
                            iconColor={colors.onPrimary}
                            onPress={() => setMenuVisible(true)}
                            accessibilityLabel="Opciones de la plantilla"
                        />
                    }
                >
                    <Menu.Item leadingIcon="pencil" title="Editar" onPress={() => choose(onEdit)} />
                    <Menu.Item
                        leadingIcon="delete"
                        title="Eliminar"
                        titleStyle={{ color: colors.error }}
                        onPress={() => choose(onDelete)}
                    />
                </Menu>
            </View>

            <View style={styles.body}>
                {visible.map((exercise, index) => (
                    <View
                        key={exercise.id}
                        style={[
                            styles.exerciseRow,
                            index > 0 && { borderTopWidth: 1, borderTopColor: colors.outlineVariant },
                        ]}
                    >
                        <Text variant="bodyMedium" style={styles.exerciseName}>
                            {exercise.name}
                        </Text>
                        <Text
                            variant="bodyMedium"
                            style={[styles.exerciseMeta, { color: colors.onSurfaceVariant }]}
                        >
                            {exercise.sets} × {exercise.reps}
                        </Text>
                    </View>
                ))}
                {hidden > 0 ? (
                    <Text variant="bodySmall" style={[styles.more, { color: colors.onSurfaceVariant }]}>
                        y {hidden} más
                    </Text>
                ) : null}
            </View>

            <View style={styles.footer}>
                <Button mode="contained" icon="account-multiple-plus" onPress={() => onAssign(template)}>
                    Asignar a clientes
                </Button>
            </View>
        </Card>
    );
}

const styles = StyleSheet.create({
    card: {
        marginBottom: 16,
        overflow: 'hidden',
    },
    banner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: 16,
        paddingRight: 4,
        paddingVertical: 8,
    },
    bannerText: {
        flex: 1,
    },
    title: {
        fontWeight: 'bold',
    },
    count: {
        marginTop: 2,
        opacity: 0.85,
    },
    body: {
        paddingHorizontal: 16,
        paddingTop: 8,
    },
    exerciseRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
    },
    exerciseName: {
        flex: 1,
        marginRight: 12,
    },
    exerciseMeta: {
        fontWeight: '600',
    },
    more: {
        paddingVertical: 8,
    },
    footer: {
        padding: 16,
    },
});