import { Type } from 'class-transformer';
import {
  ArrayMinSize,
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
  @IsUUID('4', { message: 'El cliente no es válido.' })
  clientId?: string;

  @IsOptional()
  @IsBoolean()
  isTemplate?: boolean;

  @IsArray()
  @ArrayMinSize(1, { message: 'Agrega al menos un ejercicio.' })
  @ValidateNested({ each: true })
  @Type(() => ExerciseDto)
  exercises: ExerciseDto[];
}