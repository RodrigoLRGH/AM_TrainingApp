import { useCallback, useState } from 'react';
import type { NewExercise } from '../../api/types';
import { useExerciseDrafts } from './useExerciseDrafts';

export type { ExerciseDraft } from './useExerciseDrafts';
export type TemplatePayload = { title: string; exercises: NewExercise[] };

type Source = { title: string; exercises: { name: string; sets: number; reps: number }[] };

function titleError(value: string) {
    const trimmed = value.trim();
    if (trimmed === '') {
        return 'El título es obligatorio.';
    }
    if (trimmed.length < 2) {
        return 'El título debe tener al menos 2 caracteres.';
    }
    return undefined;
}

export function useTemplateDraft() {
    const [title, setTitle] = useState('');
    const [titleTouched, setTitleTouched] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const drafts = useExerciseDrafts();
    const { reset } = drafts;

    const fill = useCallback(
        (source: Source) => {
            setTitle(source.title);
            setTitleTouched(false);
            setSubmitted(false);
            reset(source.exercises);
        },
        [reset],
    );

    function buildPayload(): TemplatePayload | null {
        setSubmitted(true);
        const exercises = drafts.build();
        if (titleError(title) || !exercises) {
            return null;
        }
        return { title: title.trim(), exercises };
    }

    return {
        title,
        setTitle,
        onTitleBlur: () => setTitleTouched(true),
        titleError: titleTouched || submitted ? titleError(title) : undefined,
        drafts,
        fill,
        buildPayload,
    };
}

export type TemplateDraftApi = ReturnType<typeof useTemplateDraft>;
