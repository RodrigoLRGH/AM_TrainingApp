import { useNewAnnouncement } from '../features/announcements/useNewAnnouncement';
import { AnnouncementForm } from '../components/AnnouncementForm';

export default function NewAnnouncementScreen() {
    const announcement = useNewAnnouncement();

    return <AnnouncementForm announcement={announcement} />;
}