import { isAxiosError } from 'axios';

type ErrorBody = {
    message?: string | string[];
};

export function isNetworkError(error: unknown) {
    return isAxiosError(error) && !error.response;
}

/**
 * Mensaje para mostrar en pantalla cuando falla la carga de datos.
 * Los errores de red (sin internet, modo avión) son esperados y no se registran en consola;
 * cualquier otro error se registra como advertencia para poder depurarlo.
 */
export function loadErrorMessage(error: unknown, fallback: string) {
    if (!isNetworkError(error)) {
        console.warn(fallback, error);
    }
    return getErrorMessage(error, fallback);
}

export function shouldRetry(error: unknown) {
    return isAxiosError(error) && (!error.response || error.response.status >= 500);
}

export function getErrorMessage(error: unknown, fallback: string) {
    if (isNetworkError(error)) {
        return 'Sin conexión con el servidor. Revisa tu internet e inténtalo de nuevo.';
    }

    if (isAxiosError<ErrorBody>(error)) {
        const message = error.response?.data?.message;

        if (Array.isArray(message)) {
            return message.join('\n');
        }

        if (message) {
            return message;
        }
    }

    return fallback;
}