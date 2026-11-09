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
export function exactLength(length: number, message: string): Rule {
    return (value) => (value.trim().length === length ? null : message);
}

export function integerAtLeast(min: number, message: string): Rule {
    return (value) => {
        const trimmed = value.trim();
        return /^\d+$/.test(trimmed) && Number(trimmed) >= min ? null : message;
    };
}

/** Campo opcional: vacío es válido; si tiene algo, debe ser un número mayor a cero (acepta coma). */
export function optionalPositiveNumber(message: string): Rule {
    return (value) => {
        const trimmed = value.trim();
        if (trimmed === '') {
            return null;
        }
        const parsed = Number(trimmed.replace(',', '.'));
        return Number.isFinite(parsed) && parsed > 0 ? null : message;
    };
}
