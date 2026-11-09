import { Stack, useLocalSearchParams } from 'expo-router';
import { useAssignTemplate } from '../../features/routines/useAssignTemplate';
import { AssignTemplateForm } from '../../components/AssignTemplateForm';

export default function AssignTemplateScreen() {
    const { id, title } = useLocalSearchParams<{ id: string; title: string }>();
    const assign = useAssignTemplate(id);

    return (
        <>
            <Stack.Screen options={{ title }} />
            <AssignTemplateForm assign={assign} />
        </>
    );
}
