import { IsInt, IsLatitude, IsLongitude, Min } from 'class-validator';

export class SetGymLocationDto {
  @IsLatitude()
  latitude: number;

  @IsLongitude()
  longitude: number;

  @IsInt()
  @Min(10, { message: 'El radio debe ser de al menos 10 metros.' })
  radiusMeters: number;
}