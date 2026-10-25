import { useState } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { createAnnouncement } from '../../api/announcements';
import { getErrorMessage } from '../../api/errors';
import { useForm } from '../forms/useForm';
import { compose, minLength, required } from '../forms/rules';

type AnnouncementValues = {
    title: string;
    message: string;
};

const INITIAL_VALUES: AnnouncementValues = {
    title: '',
    message: '',
};

export function useNewAnnouncement() {
    const router = useRouter();
    const [saving, setSaving] = useState(false);

    const form = useForm<AnnouncementValues>(INITIAL_VALUES, {
        title: compose(
            required('Escribe un título.'),
            minLength(2, 'El título debe tener al menos 2 caracteres.'),
        ),
        message: compose(
            required('Escribe el mensaje.'),
            minLength(2, 'El mensaje debe tener al menos 2 caracteres.'),
        ),
    });

    async function submit() {
        if (!form.validate()) {
            return;
        }

        setSaving(true);
        try {
            await createAnnouncement({
                title: form.values.title.trim(),
                message: form.values.message.trim(),
            });
            Alert.alert(
                'Aviso publicado',
                'Tus clientes activos recibirán una notificación.',
                [{ text: 'Listo', onPress: () => router.back() }],
            );
        } catch (error) {
            Alert.alert(getErrorMessage(error, 'No se pudo publicar el aviso.'));
        } finally {
            setSaving(false);
        }
    }

    return {
        values: form.values,
        setValue: form.setValue,
        handleBlur: form.handleBlur,
        errorFor: form.errorFor,
        saving,
        submit,
    };
}

export type NewAnnouncementApi = ReturnType<typeof useNewAnnouncement>;