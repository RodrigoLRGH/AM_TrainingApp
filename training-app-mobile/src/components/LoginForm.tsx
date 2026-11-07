import type { LoginMode } from '../features/auth/useLogin';
import { FormField } from './FormField';

type Props = {
    mode: LoginMode;
    email: string;
    onEmailChange: (value: string) => void;
    password: string;
    onPasswordChange: (value: string) => void;
    clientCode: string;
    onClientCodeChange: (value: string) => void;
};

export function LoginForm({
    mode,
    email,
    onEmailChange,
    password,
    onPasswordChange,
    clientCode,
    onClientCodeChange,
}: Props) {
    if (mode === 'client') {
        return (
            <FormField
                label="Código de cliente"
                placeholder="Ej. ABC123"
                value={clientCode}
                onChangeText={onClientCodeChange}
                autoCapitalize="characters"
            />
        );
    }

    return (
        <>
            <FormField
                label="Correo electrónico"
                placeholder="tucorreo@ejemplo.com"
                value={email}
                onChangeText={onEmailChange}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <FormField
                label="Contraseña"
                placeholder="Escribe tu contraseña"
                value={password}
                onChangeText={onPasswordChange}
                secure
                autoCapitalize="none"
            />
        </>
    );
}
