import { IsDateString, IsOptional } from 'class-validator';

export class FinishRunDto {
  /**
   * Hora real en que terminó la corrida. La app la manda al terminar una corrida
   * que se interrumpió (p. ej. porque se cerró la app), para que la duración no
   * incluya el tiempo que estuvo cerrada. Si no se manda, se usa la hora actual.
   */
  @IsOptional()
  @IsDateString({}, { message: 'La hora de término debe tener formato válido.' })
  endedAt?: string;
}
