import type { Coordinate } from '../api/types';

const EARTH_RADIUS_METERS = 6371000;

function toRadians(degrees: number) {
    return (degrees * Math.PI) / 180;
}

export function distanceBetween(a: Coordinate, b: Coordinate) {
    const deltaLat = toRadians(b.latitude - a.latitude);
    const deltaLon = toRadians(b.longitude - a.longitude);

    const h =
        Math.sin(deltaLat / 2) ** 2 +
        Math.cos(toRadians(a.latitude)) *
        Math.cos(toRadians(b.latitude)) *
        Math.sin(deltaLon / 2) ** 2;

    return 2 * EARTH_RADIUS_METERS * Math.asin(Math.sqrt(h));
}

export function totalDistance(route: Coordinate[]) {
    let total = 0;

    for (let i = 1; i < route.length; i++) {
        total += distanceBetween(route[i - 1], route[i]);
    }

    return total;
}