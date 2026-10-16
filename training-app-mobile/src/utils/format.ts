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