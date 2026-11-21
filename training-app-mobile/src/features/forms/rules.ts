import type { Rule } from './useForm';

export function required(message: string): Rule {
    return (value) => (value.trim() === '' ? message : null);
}

export function minLength(length: number, message: string): Rule {
    return (value) => (value.trim().length < length ? message : null);
}

export function maxLength(length: number, message: string): Rule {
    return (value) => (value.trim().length > length ? message : null);
}

/** Largo en bytes UTF-8 (una letra con acento o un emoji ocupa más de un byte). */
export function utf8ByteLength(value: string) {
    return new TextEncoder().encode(value).length;
}

export function maxBytes(bytes: number, message: string): Rule {
    return (value) => (utf8ByteLength(value) > bytes ? message : null);
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

export function integerBetween(min: number, max: number, message: string): Rule {
    return (value) => {
        const trimmed = value.trim();
        const parsed = Number(trimmed);
        return /^\d+$/.test(trimmed) && parsed >= min && parsed <= max ? null : message;
    };
}

/**
 * Campo opcional: vacío es válido; si tiene algo, debe ser un número mayor a cero (acepta coma)
 * y, si se indica, no mayor a `max`.
 */
export function optionalPositiveNumber(
    message: string,
    max?: { value: number; message: string },
): Rule {
    return (value) => {
        const trimmed = value.trim();
        if (trimmed === '') {
            return null;
        }
        const parsed = Number(trimmed.replace(',', '.'));
        if (!Number.isFinite(parsed) || parsed <= 0) {
            return message;
        }
        return max && parsed > max.value ? max.message : null;
    };
}
