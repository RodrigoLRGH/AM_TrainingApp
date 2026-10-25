import { ScrollView, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import type { NewAnnouncementApi } from '../features/announcements/useNewAnnouncement';
import { FormField } from './FormField';

type Props = {
    announcement: NewAnnouncementApi;
};

export function AnnouncementForm({ announcement }: Props) {
    const { values, setValue, handleBlur, errorFor, saving, submit } = announcement;

    return (
        <ScrollView
            contentContainerStyle={styles.container}
            keyboardShouldPersistTaps="handled"
            automaticallyAdjustKeyboardInsets
        >
            <FormField
                label="Título"
                value={values.title}
                onChangeText={(value) => setValue('title', value)}
                onBlur={() => handleBlur('title')}
                error={errorFor('title')}
                autoCapitalize="sentences"
            />
            <FormField
                label="Mensaje"
                value={values.message}
                onChangeText={(value) => setValue('message', value)}
                onBlur={() => handleBlur('message')}
                error={errorFor('message')}
                autoCapitalize="sentences"
                multiline
            />

            <Button
                mode="contained"
                icon="send"
                onPress={submit}
                loading={saving}
                disabled={saving}
                style={styles.submit}
            >
                Publicar aviso
            </Button>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        paddingBottom: 32,
    },
    submit: {
        marginTop: 16,
    },
});