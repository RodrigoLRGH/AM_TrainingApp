import { IsBoolean } from 'class-validator';

export class SetExerciseCompletedDto {
    @IsBoolean({ message: 'El valor de "completed" debe ser verdadero o falso.' })
    completed: boolean;
}