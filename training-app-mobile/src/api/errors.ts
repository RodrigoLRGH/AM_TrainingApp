import { isAxiosError } from 'axios';

type ErrorBody = {
    message?: string | string[];
};

export function getErrorMessage(error: unknown, fallback: string) {
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