import { useLocalSearchParams } from 'expo-router';
import { useAssignTemplate } from '../../features/routines/useAssignTemplate';
import { AssignTemplateForm } from '../../components/AssignTemplateForm';

export default function AssignTemplateScreen() {
    const { id, title } = useLocalSearchParams<{ id: string; title: string }>();
    const assign = useAssignTemplate(id);

    return (
        <AssignTemplateForm
            templateTitle={title}
            clients={assign.clients}
            loadingClients={assign.loadingClients}
            selectedIds={assign.selectedIds}
            onToggleClient={assign.toggleClient}
            date={assign.date}
            onDateChange={assign.setDate}
            minimumDate={assign.minimumDate}
            onSubmit={assign.submit}
            saving={assign.saving}
        />
    );
}