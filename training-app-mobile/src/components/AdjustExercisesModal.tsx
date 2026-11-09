import { ScrollView, View, StyleSheet } from 'react-native';
import { Portal, Modal, Text, Button, useTheme } from 'react-native-paper';
import type { NewExercise } from '../api/types';
import { useExerciseDrafts } from '../features/routines/useExerciseDrafts';
import { ExerciseListEditor } from './ExerciseListEditor';

// Se monta solo mientras está abierto, así los ejercicios iniciales se toman al abrir.
type Props = {
    clientName: string;
    /** Ejercicios con los que se abre: el ajuste guardado o los de la plantilla. */
    initial: NewExercise[];
    customized: boolean;
    onSave: (exercises: NewExercise[]) => void;
    onRestore: () => void;
    onDismiss: () => void;
};

export function AdjustExercisesModal({
    clientName,
    initial,
    customized,
    onSave,
    onRestore,
    onDismiss,
}: Props) {
    const { colors } = useTheme();
    const drafts = useExerciseDrafts(initial);

    function save() {
        const exercises = drafts.build();
        if (exercises) {
            onSave(exercises);
        }
    }

    return (
        <Portal>
            <Modal
                visible
                onDismiss={onDismiss}
                contentContainerStyle={[styles.modal, { backgroundColor: colors.surface }]}
            >
                <Text variant="titleMedium">Ajustar para {clientName}</Text>
                <Text variant="bodySmall" style={[styles.hint, { color: colors.onSurfaceVariant }]}>
                    Los cambios solo aplican a este cliente. La plantilla original no se modifica.
                </Text>

                <ScrollView
                    style={styles.fields}
                    keyboardShouldPersistTaps="handled"
                    keyboardDismissMode="on-drag"
                    automaticallyAdjustKeyboardInsets
                >
                    <ExerciseListEditor drafts={drafts} />
                </ScrollView>

                <View style={styles.actions}>
                    {customized ? (
                        <Button onPress={onRestore} style={styles.restore}>
                            Usar plantilla
                        </Button>
                    ) : null}
                    <Button onPress={onDismiss}>Cancelar</Button>
                    <Button mode="contained" onPress={save}>
                        Guardar
                    </Button>
                </View>
            </Modal>
        </Portal>
    );
}

const styles = StyleSheet.create({
    modal: {
        padding: 20,
        margin: 16,
        borderRadius: 16,
        maxHeight: '85%',
    },
    hint: {
        marginTop: 4,
        marginBottom: 12,
    },
    fields: {
        marginBottom: 12,
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 8,
    },
    restore: {
        marginRight: 'auto',
    },
});
