import { View, StyleSheet } from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useEditTemplate } from '../../features/routines/useEditTemplate';
import { TemplateForm } from '../../components/TemplateForm';
import { DateField } from '../../components/DateField';
import { SectionHeader } from '../../components/SectionHeader';

export default function EditTemplateScreen() {
    // Con clientId se edita una rutina ya asignada a ese cliente; sin él, una plantilla.
    const { id, clientId } = useLocalSearchParams<{ id: string; clientId?: string }>();
    const edit = useEditTemplate(id, clientId);
    const screenTitle = edit.isAssigned ? 'Editar rutina' : 'Editar plantilla';

    if (edit.loading) {
        return (
            <View style={styles.center}>
                <Stack.Screen options={{ title: screenTitle }} />
                <ActivityIndicator size="large" />
            </View>
        );
    }

    if (edit.notFound) {
        return (
            <View style={styles.center}>
                <Stack.Screen options={{ title: screenTitle }} />
                <Text variant="bodyLarge">
                    {edit.isAssigned ? 'No encontramos esta rutina.' : 'No encontramos esta plantilla.'}
                </Text>
            </View>
        );
    }

    return (
        <>
            <Stack.Screen options={{ title: screenTitle }} />
            <TemplateForm
                draft={edit.draft}
                onSubmit={edit.submit}
                saving={edit.saving}
                submitLabel="Guardar cambios"
                extra={
                    edit.isAssigned ? (
                        <>
                            <SectionHeader title="Fecha" />
                            <DateField value={edit.date} onChange={edit.setDate} />
                        </>
                    ) : undefined
                }
            />
        </>
    );
}

const styles = StyleSheet.create({
    center: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
