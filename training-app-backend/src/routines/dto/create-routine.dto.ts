import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { ExerciseDto } from './exercise.dto';

export class CreateRoutineDto {
  @IsString()
  @MinLength(2, { message: 'El título debe tener al menos 2 caracteres.' })
  title: string;

  @IsOptional()
  @IsDateString({}, { message: 'La fecha debe tener formato válido (ISO 8601).' })
  date?: string;

  @IsOptional()
  @IsUUID()
  clientId?: string;

  @IsOptional()
  @IsBoolean()
  isTemplate?: boolean;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExerciseDto)
  exercises: ExerciseDto[];
}