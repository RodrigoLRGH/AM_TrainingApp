import { useState } from 'react';

export type Rule = (value: string, values: Record<string, string>) => string | null;
export type Rules<T> = Partial<Record<keyof T, Rule>>;

export function useForm<T extends Record<string, string>>(initial: T, rules: Rules<T>) {
    const [values, setValues] = useState<T>(initial);
    const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});
    const [submitted, setSubmitted] = useState(false);

    const keys = Object.keys(initial) as (keyof T)[];

    const errors: Partial<Record<keyof T, string>> = {};
    for (const key of keys) {
        const rule = rules[key];
        const message = rule ? rule(values[key], values) : null;
        if (message) {
            errors[key] = message;
        }
    }

    function setValue(key: keyof T, value: string) {
        setValues((prev) => ({ ...prev, [key]: value }));
    }

    function handleBlur(key: keyof T) {
        setTouched((prev) => ({ ...prev, [key]: true }));
    }

    function errorFor(key: keyof T) {
        return touched[key] || submitted ? errors[key] : undefined;
    }

    function validate() {
        setSubmitted(true);
        return keys.every((key) => !errors[key]);
    }

    return { values, setValue, handleBlur, errorFor, validate };
}