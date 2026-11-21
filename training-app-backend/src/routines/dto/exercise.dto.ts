import { IsInt, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';
import { LIMITS } from '../../common/limits';

export class ExerciseDto {
  @IsString()
  @MinLength(2, { message: 'El nombre del ejercicio es muy corto.' })
  @MaxLength(LIMITS.exerciseName, {
    message: `El nombre del ejercicio puede tener máximo ${LIMITS.exerciseName} caracteres.`,
  })
  name: string;

  @IsInt()
  @Min(1, { message: 'Las series deben ser al menos 1.' })
  @Max(LIMITS.sets, { message: `Las series pueden ser máximo ${LIMITS.sets}.` })
  sets: number;

  @IsInt()
  @Min(1, { message: 'Las repeticiones deben ser al menos 1.' })
  @Max(LIMITS.reps, { message: `Las repeticiones pueden ser máximo ${LIMITS.reps}.` })
  reps: number;
}