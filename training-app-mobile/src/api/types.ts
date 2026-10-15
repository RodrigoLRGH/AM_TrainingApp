export type Role = 'INSTRUCTOR' | 'CLIENTE';

export type AuthResponse = {
    accessToken: string;
    user: {
        id: string;
        role: Role;
        name: string;
    };
};

export type Client = {
    id: string;
    name: string;
    clientCode: string;
    active: boolean;
    createdAt: string;
};

export type Exercise = {
    id: string;
    name: string;
    sets: number;
    reps: number;
};

export type NewExercise = {
    name: string;
    sets: number;
    reps: number;
};

export type Template = {
    id: string;
    title: string;
    exercises: Exercise[];
};

export type Routine = {
    id: string;
    title: string;
    date: string;
    exercises: Exercise[];
};

export type GymConfig = {
    gymLatitude: number | null;
    gymLongitude: number | null;
    gymRadiusMeters: number | null;
    gymQrCode: string | null;
};

export type AttendanceMethod = 'GEO' | 'QR';

export type AttendanceRecord = {
    id: string;
    method: AttendanceMethod;
    date: string;
    client: {
        id: string;
        name: string;
    };
};

export type CheckinResult = {
    id: string;
    method: AttendanceMethod;
    date: string;
    clientId: string;
    instructorId: string;
};