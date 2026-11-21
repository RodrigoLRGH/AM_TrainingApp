import { IsInt, IsLatitude, IsLongitude, Max, Min } from 'class-validator';
import { LIMITS } from '../../common/limits';

export class SetGymLocationDto {
  @IsLatitude()
  latitude: number;

  @IsLongitude()
  longitude: number;

  @IsInt()
  @Min(10, { message: 'El radio debe ser de al menos 10 metros.' })
  @Max(LIMITS.gymRadiusMeters, {
    message: `El radio puede ser máximo ${LIMITS.gymRadiusMeters} metros.`,
  })
  radiusMeters: number;
}