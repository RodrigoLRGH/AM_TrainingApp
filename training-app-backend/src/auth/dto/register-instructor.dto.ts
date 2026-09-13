import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterInstructorDto {
  @IsString()
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres.' })
  name: string;

  @IsEmail({}, { message: 'El correo electrónico no es válido.' })
  email: string;

  @IsString()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres.' })
  password: string;
}