import type { LoginApi } from '../features/auth/useLogin';
import { FormField } from './FormField';

type Props = {
    login: LoginApi;
};

export function LoginForm({ login }: Props) {
    if (login.mode === 'client') {
        const { values, setValue, handleBlur, errorFor } = login.clientForm;
        return (
            <FormField
                label="Código de cliente"
                placeholder="Ej. ABC123"
                value={values.clientCode}
                onChangeText={(value) => setValue('clientCode', value)}
                onBlur={() => handleBlur('clientCode')}
                error={errorFor('clientCode')}
                autoCapitalize="characters"
            />
        );
    }

    const { values, setValue, handleBlur, errorFor } = login.instructorForm;
    return (
        <>
            <FormField
                label="Correo electrónico"
                placeholder="tucorreo@ejemplo.com"
                value={values.email}
                onChangeText={(value) => setValue('email', value)}
                onBlur={() => handleBlur('email')}
                error={errorFor('email')}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <FormField
                label="Contraseña"
                placeholder="Escribe tu contraseña"
                value={values.password}
                onChangeText={(value) => setValue('password', value)}
                onBlur={() => handleBlur('password')}
                error={errorFor('password')}
                secure
                autoCapitalize="none"
            />
        </>
    );
}
