import { IsString } from 'class-validator';

export class CheckinQrDto {
  @IsString()
  qrCode: string;
}