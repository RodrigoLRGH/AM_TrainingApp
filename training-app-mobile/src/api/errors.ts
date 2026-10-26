import { isAxiosError } from 'axios';

type ErrorBody = {
    message?: string | string[];
};

export function isNetworkError(error: unknown) {
    return isAxiosError(error) && !error.response;
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