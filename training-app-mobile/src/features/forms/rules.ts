import type { Rule } from './useForm';

export function required(message: string): Rule {
    return (value) => (value.trim() === '' ? message : null);
}

export function minLength(length: number, message: string): Rule {
    return (value) => (value.trim().length < length ? message : null);
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isEmail(message: string): Rule {
    return (value) => (EMAIL_PATTERN.test(value.trim()) ? null : message);
}

export function matches(field: string, message: string): Rule {
    return (value, values) => (value === values[field] ? null : message);
}

export function compose(...rules: Rule[]): Rule {
    return (value, values) => {
        for (const rule of rules) {
            const message = rule(value, values);
            if (message) {
                return message;
            }
        }
        return null;
    };
}