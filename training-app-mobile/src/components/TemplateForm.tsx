import type { ReactNode } from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';
import type { TemplateDraftApi } from '../features/routines/useTemplateDraft';
import { ExerciseListEditor } from './ExerciseListEditor';
import { FormField } from './FormField';

type Props = {
    draft: TemplateDraftApi;
    onSubmit: () => void;
    saving: boolean;
    submitLabel?: string;
    /** Contenido extra entre el título y los ejercicios (p. ej. la fecha de una rutina asignada). */
    extra?: ReactNode;
};

export function TemplateForm({
    draft,
    onSubmit,
    saving,
    submitLabel = 'Guardar plantilla',
    extra,
}: Props) {
    return (
        <ScrollView
            contentContainerStyle={styles.container}
            contentInsetAdjustmentBehavior="automatic"
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            automaticallyAdjustKeyboardInsets
        >
            <FormField
                label="Título de la rutina"
                value={draft.title}
                onChangeText={draft.setTitle}
                onBlur={draft.onTitleBlur}
                error={draft.titleError}
                autoCapitalize="sentences"
            />

            {extra ? <View style={styles.extra}>{extra}</View> : null}

            <Text variant="labelLarge" style={styles.sectionLabel}>
                Ejercicios
            </Text>
            <ExerciseListEditor drafts={draft.drafts} />

            <Button
                mode="contained"
                onPress={onSubmit}
                loading={saving}
                disabled={saving}
                style={styles.submit}
            >
                {submitLabel}
            </Button>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        paddingBottom: 32,
    },
    extra: {
        marginBottom: 16,
    },
    sectionLabel: {
        marginBottom: 8,
    },
    submit: {
        marginTop: 16,
    },
});
