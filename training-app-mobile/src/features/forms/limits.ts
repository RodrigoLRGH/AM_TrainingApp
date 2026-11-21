/**
 * Límites de longitud y rango de los datos que acepta la API.
 * Copia de training-app-backend/src/common/limits.ts: si cambias un valor, cámbialo en ambos.
 */
export const LIMITS = {
    personName: 60,
    /** Largo máximo de un correo según el estándar (RFC 5321). */
    email: 254,
    /** bcrypt solo usa los primeros 72 bytes; lo demás se ignoraría sin avisar. */
    passwordBytes: 72,
    routineTitle: 60,
    exerciseName: 50,
    exercisesPerRoutine: 30,
    sets: 20,
    reps: 100,
    announcementTitle: 80,
    announcementMessage: 1000,
    ratingNote: 500,
    weightKg: 400,
    bodyCm: 300,
    gymRadiusMeters: 1000,
    runPointsPerRequest: 1000,
} as const;
