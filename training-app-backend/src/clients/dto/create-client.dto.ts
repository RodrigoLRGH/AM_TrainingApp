import { IsString, MaxLength, MinLength } from 'class-validator';
import { LIMITS } from '../../common/limits';

export class CreateClientDto {
  @IsString()
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres.' })
  @MaxLength(LIMITS.personName, {
    message: `El nombre puede tener máximo ${LIMITS.personName} caracteres.`,
  })
  name: string;
}