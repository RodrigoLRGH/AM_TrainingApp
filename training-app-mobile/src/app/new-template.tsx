import { useNewTemplate } from '../features/routines/useNewTemplate';
import { TemplateForm } from '../components/TemplateForm';

export default function NewTemplateScreen() {
    const {
        title,
        setTitle,
        exercises,
        addExercise,
        updateExercise,
        removeExercise,
        saving,
        submit,
    } = useNewTemplate();

    return (
        <TemplateForm
            title={title}
            onTitleChange={setTitle}
            exercises={exercises}
            onExerciseChange={updateExercise}
            onExerciseRemove={removeExercise}
            onAddExercise={addExercise}
            onSubmit={submit}
            saving={saving}
        />
    );
}