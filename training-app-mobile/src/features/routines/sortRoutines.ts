import type { Routine } from '../../api/types';
import { startOfToday } from '../../utils/format';

export function sortRoutines(routines: Routine[]) {
    const today = startOfToday().getTime();
    const time = (routine: Routine) => new Date(routine.date).getTime();

    const upcoming = routines.filter((routine) => time(routine) >= today);
    const past = routines.filter((routine) => time(routine) < today);

    upcoming.sort((a, b) => time(a) - time(b));
    past.sort((a, b) => time(b) - time(a));

    return [...upcoming, ...past];
}