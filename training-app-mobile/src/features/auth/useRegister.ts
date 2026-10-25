import { useState } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { registerInstructor } from '../../api/auth';
import { getErrorMessage } from '../../api/errors';
import { useAuth } from '../../auth/AuthContext';
import { useForm } from '../forms/useForm';
import { compose, isEmail, matches, minLength, required } from '../forms/rules';

type RegisterValues = {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
};

const INITIAL_VALUES: RegisterValues = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
};

export function useRegister() {
    const router = useRouter();
    const { signIn } = useAuth();
    const [saving, setSaving] = useState(false);

    const form = useForm<RegisterValues>(INITIAL_VALUES, {
        name: compose(
            required('Escribe tu nombre.'),
            minLength(2, 'El nombre debe tener al menos 2 caracteres.'),
        ),
        email: compose(
            required('Escribe tu correo electrónico.'),
            isEmail('El correo electrónico no es válido.'),
        ),
        password: compose(
            required('Escribe una contraseña.'),
            minLength(8, 'La contraseña debe tener al menos 8 caracteres.'),
        ),
        confirmPassword: compose(
            required('Confirma tu contraseña.'),
            matches('password', 'Las contraseñas no coinciden.'),
        ),
    });

    async function submit() {
        if (!form.validate()) {
            return;
        }

        setSaving(true);
        try {
            const { name, email, password } = form.values;
            const data = await registerInstructor(name.trim(), email.trim(), password);
            await signIn(data.accessToken, 'INSTRUCTOR');
            router.replace('/(instructor)/clients');
        } catch (error) {
            Alert.alert(getErrorMessage(error, 'No se pudo crear la cuenta.'));
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

export type RegisterApi = ReturnType<typeof useRegister>;