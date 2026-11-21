import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsDateString,
  IsLatitude,
  IsLongitude,
  ValidateNested,
} from 'class-validator';
import { LIMITS } from '../../common/limits';

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
  @ArrayMaxSize(LIMITS.runPointsPerRequest)
  @ValidateNested({ each: true })
  @Type(() => RunPointDto)
  points: RunPointDto[];
}