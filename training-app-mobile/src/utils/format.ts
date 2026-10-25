function pad(value: number) {
    return String(value).padStart(2, '0');
}

export function formatDuration(totalSeconds: number) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
        return `${hours}:${pad(minutes)}:${pad(seconds)}`;
    }

    return `${pad(minutes)}:${pad(seconds)}`;
}

export function formatKm(meters: number) {
    return (meters / 1000).toFixed(2);
}

export function formatPace(meters: number, seconds: number) {
    if (meters < 50) {
        return '--:--';
    }

    const secondsPerKm = Math.round(seconds / (meters / 1000));
    const minutes = Math.floor(secondsPerKm / 60);
    const rest = secondsPerKm % 60;

    return `${minutes}:${pad(rest)}`;
}

export function formatDateTime(iso: string) {
    const date = new Date(iso);
    const day = date.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' });
    const time = date.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
    return `${day}, ${time}`;
}

export function startOfToday() {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

export function toNoonIso(date: Date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0).toISOString();
}

export function formatDayLabel(iso: string) {
    const text = new Date(iso).toLocaleDateString('es-MX', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
    });
    return text.charAt(0).toUpperCase() + text.slice(1);
}