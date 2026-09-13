import { IsEmail, IsString } from 'class-validator';

export class LoginInstructorDto {
  @IsEmail({}, { message: 'El correo electrónico no es válido.' })
  email: string;

  @IsString()
  password: string;
}