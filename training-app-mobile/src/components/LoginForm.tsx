import { TextInput, StyleSheet } from 'react-native';
import type { LoginMode } from '../features/auth/useLogin';

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
            <TextInput
                style={styles.input}
                placeholder="Código de cliente"
                value={clientCode}
                onChangeText={onClientCodeChange}
                autoCapitalize="characters"
            />
        );
    }

    return (
        <>
            <TextInput
                style={styles.input}
                placeholder="Correo electrónico"
                value={email}
                onChangeText={onEmailChange}
                autoCapitalize="none"
                keyboardType="email-address"
            />
            <TextInput
                style={styles.input}
                placeholder="Contraseña"
                value={password}
                onChangeText={onPasswordChange}
                secureTextEntry
            />
        </>
    );
}

const styles = StyleSheet.create({
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 14,
        marginBottom: 16,
        fontSize: 16,
    },
});