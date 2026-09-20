import { Type } from 'class-transformer';
import { IsArray, IsDateString, IsOptional, IsUUID, ValidateNested } from 'class-validator';
import { ExerciseDto } from './exercise.dto';

export class AssignTemplateDto {
  @IsArray()
  @IsUUID('4', { each: true })
  clientIds: string[];

  @IsDateString({}, { message: 'La fecha debe tener formato válido.' })
  date: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExerciseDto)
  exercises?: ExerciseDto[];
}