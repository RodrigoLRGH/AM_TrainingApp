import { Type } from 'class-transformer';
import { IsArray, IsDateString, IsLatitude, IsLongitude, ValidateNested } from 'class-validator';

class RunPointDto {
  @IsLatitude()
  latitude: number;

  @IsLongitude()
  longitude: number;

  @IsDateString()
  timestamp: string;
}

export class AddPointsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RunPointDto)
  points: RunPointDto[];
}