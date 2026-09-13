import { IsString, Length } from 'class-validator';

export class LoginClientDto {
  @IsString()
  @Length(6, 6, { message: 'El código de cliente debe tener 6 caracteres.' })
  clientCode: string;
}