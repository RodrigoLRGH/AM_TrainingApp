import { useLogout } from '../../features/auth/useLogout';
import { ProfileView } from '../../components/ProfileView';

export default function ClientProfileScreen() {
    const { logout } = useLogout();

    return <ProfileView roleLabel="cliente" onLogout={logout} />;
}