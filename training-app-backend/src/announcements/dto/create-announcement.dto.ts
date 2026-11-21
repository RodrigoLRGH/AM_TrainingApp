import { IsString, MaxLength, MinLength } from 'class-validator';
import { LIMITS } from '../../common/limits';

export class CreateAnnouncementDto {
  @IsString()
  @MinLength(2)
  @MaxLength(LIMITS.announcementTitle, {
    message: `El título puede tener máximo ${LIMITS.announcementTitle} caracteres.`,
  })
  title: string;

  @IsString()
  @MinLength(2)
  @MaxLength(LIMITS.announcementMessage, {
    message: `El mensaje puede tener máximo ${LIMITS.announcementMessage} caracteres.`,
  })
  message: string;
}