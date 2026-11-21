import { IsEmail, IsString, MaxLength } from 'class-validator';
import { LIMITS } from '../../common/limits';

export class LoginInstructorDto {
  @IsEmail({}, { message: 'El correo electrónico no es válido.' })
  @MaxLength(LIMITS.email, { message: 'El correo electrónico es demasiado largo.' })
  email: string;

  @IsString()
  password: string;
}