import { useLogout } from '../../features/auth/useLogout';
import { ProfileView } from '../../components/ProfileView';

export default function ClientProfileScreen() {
    const { confirmLogout } = useLogout();

    return <ProfileView roleLabel="cliente" onLogout={confirmLogout} />;
}