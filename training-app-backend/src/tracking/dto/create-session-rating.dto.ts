import { IsInt, IsOptional, IsString, IsUUID, Max, Min } from 'class-validator';

export class CreateSessionRatingDto {
  @IsInt()
  @Min(1)
  @Max(5)
  effort: number;

  @IsOptional()
  @IsString()
  note?: string;

  @IsOptional()
  @IsUUID()
  routineId?: string;
}