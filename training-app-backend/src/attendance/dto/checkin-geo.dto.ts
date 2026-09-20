import { IsLatitude, IsLongitude } from 'class-validator';

export class CheckinGeoDto {
  @IsLatitude()
  latitude: number;

  @IsLongitude()
  longitude: number;
}