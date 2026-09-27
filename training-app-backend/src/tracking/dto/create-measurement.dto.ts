import { IsNumber, IsOptional, Min } from 'class-validator';

export class CreateMeasurementDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  weightKg?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  chestCm?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  waistCm?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  hipsCm?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  armCm?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  legCm?: number;
}