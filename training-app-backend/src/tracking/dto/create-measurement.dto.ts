import { IsNumber, IsOptional, Max, Min } from 'class-validator';
import { LIMITS } from '../../common/limits';

export class CreateMeasurementDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(LIMITS.weightKg, { message: `El peso puede ser máximo ${LIMITS.weightKg} kg.` })
  weightKg?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(LIMITS.bodyCm, { message: `Las medidas pueden ser máximo ${LIMITS.bodyCm} cm.` })
  chestCm?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(LIMITS.bodyCm, { message: `Las medidas pueden ser máximo ${LIMITS.bodyCm} cm.` })
  waistCm?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(LIMITS.bodyCm, { message: `Las medidas pueden ser máximo ${LIMITS.bodyCm} cm.` })
  hipsCm?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(LIMITS.bodyCm, { message: `Las medidas pueden ser máximo ${LIMITS.bodyCm} cm.` })
  armCm?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(LIMITS.bodyCm, { message: `Las medidas pueden ser máximo ${LIMITS.bodyCm} cm.` })
  legCm?: number;
}