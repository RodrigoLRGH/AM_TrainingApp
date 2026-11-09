import { useState } from 'react';
import { AppAlert } from '../../components/AppAlert';
import { useRouter } from 'expo-router';
import { loginInstructor, loginClient } from '../../api/auth';
import { getErrorMessage } from '../../api/errors';
import { useAuth } from '../../auth/AuthContext';
import { useForm } from '../forms/useForm';
import { compose, exactLength, isEmail, required } from '../forms/rules';

export type LoginMode = 'instructor' | 'client';

export function useLogin() {
    const router = useRouter();
    const { signIn } = useAuth();
    const [mode, setMode] = useState<LoginMode>('client');
    const [loading, setLoading] = useState(false);

    // Un formulario por rol, para que la validación de uno no bloquee al otro.
    const instructorForm = useForm(
        { email: '', password: '' },
        {
            email: compose(
                required('Escribe tu correo electrónico.'),
                isEmail('El correo electrónico no es válido.'),
            ),
            password: required('Escribe tu contraseña.'),
        },
    );
    const clientForm = useForm(
        { clientCode: '' },
        {
            clientCode: compose(
                required('Escribe tu código de cliente.'),
                exactLength(6, 'El código de cliente tiene 6 caracteres.'),
            ),
        },
    );

    async function handleLogin() {
        const form = mode === 'instructor' ? instructorForm : clientForm;
        if (!form.validate()) {
            return;
        }

        setLoading(true);
        try {
            if (mode === 'instructor') {
                const { email, password } = instructorForm.values;
                const data = await loginInstructor(email.trim(), password);
                await signIn(data.accessToken, 'INSTRUCTOR');
                router.replace('/(instructor)/clients');
            } else {
                const data = await loginClient(clientForm.values.clientCode.trim().toUpperCase());
                await signIn(data.accessToken, 'CLIENTE');
                router.replace('/(client)/routine');
            }
        } catch (error) {
            AppAlert.alert(getErrorMessage(error, 'Algo salió mal, intenta de nuevo.'));
        } finally {
            setLoading(false);
        }
    }

    return { mode, setMode, instructorForm, clientForm, loading, handleLogin };
}

export type LoginApi = ReturnType<typeof useLogin>;
