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

export type DashboardStats = {
    period: {
        from: string;
        to: string;
    };
    clients: {
        active: number;
        total: number;
    };
    attendanceRatePercent: number;
    routinesAssigned: number;
    templatesCreated: number;
};

export type Coordinate = {
    latitude: number;
    longitude: number;
};

export type RunPointInput = Coordinate & {
    timestamp: string;
};

export type RunPoint = Coordinate & {
    id: string;
    order: number;
    timestamp: string;
};

export type RunSession = {
    id: string;
    startedAt: string;
    endedAt: string | null;
    distanceMeters: number | null;
    durationSeconds: number | null;
    points?: RunPoint[];
};

export type MeasureKey = 'weightKg' | 'chestCm' | 'waistCm' | 'hipsCm' | 'armCm' | 'legCm';

export type Measurement = Record<MeasureKey, number | null> & {
    id: string;
    clientId: string;
    recordedAt: string;
};

export type NewMeasurement = Partial<Record<MeasureKey, number>>;

export type SessionRating = {
    id: string;
    clientId: string;
    routineId: string | null;
    effort: number;
    note: string | null;
    createdAt: string;
};

export type NewSessionRating = {
    effort: number;
    note?: string;
    routineId?: string;
};