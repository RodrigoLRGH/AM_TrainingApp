import { View, StyleSheet } from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';
import { useLocalSearchParams } from 'expo-router';
import { useEditTemplate } from '../../features/routines/useEditTemplate';
import { TemplateForm } from '../../components/TemplateForm';

export default function EditTemplateScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const edit = useEditTemplate(id);

    if (edit.loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    if (edit.notFound) {
        return (
            <View style={styles.center}>
                <Text variant="bodyLarge">No encontramos esta plantilla.</Text>
            </View>
        );
    }

    return (
        <TemplateForm
            title={edit.title}
            onTitleChange={edit.setTitle}
            exercises={edit.exercises}
            onExerciseChange={edit.updateExercise}
            onExerciseRemove={edit.removeExercise}
            onAddExercise={edit.addExercise}
            onSubmit={edit.submit}
            saving={edit.saving}
            submitLabel="Guardar cambios"
        />
    );
}

const styles = StyleSheet.create({
    center: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});