import { useLogout } from '../../features/auth/useLogout';
import { ProfileView } from '../../components/ProfileView';

export default function InstructorProfileScreen() {
    const { confirmLogout } = useLogout();

    return <ProfileView roleLabel="instructor" onLogout={confirmLogout} />;
}