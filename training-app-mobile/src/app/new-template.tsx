import { useNewTemplate } from '../features/routines/useNewTemplate';
import { TemplateForm } from '../components/TemplateForm';

export default function NewTemplateScreen() {
    const { draft, saving, submit } = useNewTemplate();

    return <TemplateForm draft={draft} onSubmit={submit} saving={saving} />;
}
