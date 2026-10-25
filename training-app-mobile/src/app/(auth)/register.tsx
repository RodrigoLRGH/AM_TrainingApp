import { Stack } from 'expo-router';
import { useRegister } from '../../features/auth/useRegister';
import { RegisterForm } from '../../components/RegisterForm';

export default function RegisterScreen() {
    const register = useRegister();

    return (
        <>
            <Stack.Screen
                options={{ headerShown: true, headerTransparent: false, title: 'Crear cuenta' }}
            />
            <RegisterForm register={register} />
        </>
    );
}