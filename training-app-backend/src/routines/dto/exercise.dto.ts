import { IsInt, IsString, Min, MinLength } from 'class-validator';

export class ExerciseDto {
  @IsString()
  @MinLength(2, { message: 'El nombre del ejercicio es muy corto.' })
  name: string;

  @IsInt()
  @Min(1, { message: 'Las series deben ser al menos 1.' })
  sets: number;

  @IsInt()
  @Min(1, { message: 'Las repeticiones deben ser al menos 1.' })
  reps: number;
}