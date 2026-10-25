import { ScrollView, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';
import type { RegisterApi } from '../features/auth/useRegister';
import { FormField } from './FormField';

type Props = {
    register: RegisterApi;
};

export function RegisterForm({ register }: Props) {
    const { values, setValue, handleBlur, errorFor, saving, submit } = register;

    return (
        <ScrollView
            contentContainerStyle={styles.container}
            keyboardShouldPersistTaps="handled"
            automaticallyAdjustKeyboardInsets
        >
            <Text variant="bodyMedium" style={styles.intro}>
                Crea tu cuenta de instructor para administrar a tus clientes y sus rutinas.
            </Text>

            <FormField
                label="Nombre"
                value={values.name}
                onChangeText={(value) => setValue('name', value)}
                onBlur={() => handleBlur('name')}
                error={errorFor('name')}
                autoCapitalize="words"
            />
            <FormField
                label="Correo electrónico"
                value={values.email}
                onChangeText={(value) => setValue('email', value)}
                onBlur={() => handleBlur('email')}
                error={errorFor('email')}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <FormField
                label="Contraseña"
                value={values.password}
                onChangeText={(value) => setValue('password', value)}
                onBlur={() => handleBlur('password')}
                error={errorFor('password')}
                secure
                autoCapitalize="none"
            />
            <FormField
                label="Confirmar contraseña"
                value={values.confirmPassword}
                onChangeText={(value) => setValue('confirmPassword', value)}
                onBlur={() => handleBlur('confirmPassword')}
                error={errorFor('confirmPassword')}
                secure
                autoCapitalize="none"
            />

            <Button mode="contained" onPress={submit} loading={saving} disabled={saving} style={styles.submit}>
                Crear cuenta
            </Button>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        paddingBottom: 32,
    },
    intro: {
        marginBottom: 20,
    },
    submit: {
        marginTop: 16,
    },
});