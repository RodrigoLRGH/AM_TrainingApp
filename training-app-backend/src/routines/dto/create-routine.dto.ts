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

  // RF-06: fecha del calendario. Si es plantilla (isTemplate=true), se omite.
  @IsOptional()
  @IsDateString({}, { message: 'La fecha debe tener formato válido (ISO 8601).' })
  date?: string;

  // Si se asigna directo a un cliente al crearla (sin pasar por plantilla)
  @IsOptional()
  @IsUUID()
  clientId?: string;

  // RF-24: marca esta rutina como plantilla reutilizable
  @IsOptional()
  @IsBoolean()
  isTemplate?: boolean;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExerciseDto)
  exercises: ExerciseDto[];
}