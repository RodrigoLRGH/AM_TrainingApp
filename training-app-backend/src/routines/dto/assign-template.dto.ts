import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsOptional,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { ExerciseDto } from './exercise.dto';

// Ejercicios ajustados para un cliente en particular (RF-26).
export class ClientExercisesDto {
  @IsUUID('4', { message: 'El cliente del ajuste no es válido.' })
  clientId: string;

  @IsArray()
  @ArrayMinSize(1, { message: 'Cada ajuste debe tener al menos un ejercicio.' })
  @ValidateNested({ each: true })
  @Type(() => ExerciseDto)
  exercises: ExerciseDto[];
}

export class AssignTemplateDto {
  @IsArray()
  @ArrayMinSize(1, { message: 'Selecciona al menos un cliente.' })
  @IsUUID('4', { each: true, message: 'Uno de los clientes no es válido.' })
  clientIds: string[];

  @IsDateString({}, { message: 'La fecha debe tener formato válido.' })
  date: string;

  // Ajuste común para todos los clientes.
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExerciseDto)
  exercises?: ExerciseDto[];

  // Ajustes individuales; tienen prioridad sobre "exercises" y sobre la plantilla.
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ClientExercisesDto)
  overrides?: ClientExercisesDto[];
}
