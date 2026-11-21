import { IsByteLength, IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
import { LIMITS } from '../../common/limits';

export class RegisterInstructorDto {
  @IsString()
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres.' })
  @MaxLength(LIMITS.personName, {
    message: `El nombre puede tener máximo ${LIMITS.personName} caracteres.`,
  })
  name: string;

  @IsEmail({}, { message: 'El correo electrónico no es válido.' })
  @MaxLength(LIMITS.email, { message: 'El correo electrónico es demasiado largo.' })
  email: string;

  @IsString()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres.' })
  @IsByteLength(0, LIMITS.passwordBytes, {
    message: 'La contraseña es demasiado larga.',
  })
  password: string;
}