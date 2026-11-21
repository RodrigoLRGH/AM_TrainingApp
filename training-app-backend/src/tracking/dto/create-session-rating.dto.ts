import { IsInt, IsOptional, IsString, IsUUID, Max, MaxLength, Min } from 'class-validator';
import { LIMITS } from '../../common/limits';

export class CreateSessionRatingDto {
  @IsInt()
  @Min(1)
  @Max(5)
  effort: number;

  @IsOptional()
  @IsString()
  @MaxLength(LIMITS.ratingNote, {
    message: `La nota puede tener máximo ${LIMITS.ratingNote} caracteres.`,
  })
  note?: string;

  @IsOptional()
  @IsUUID()
  routineId?: string;
}