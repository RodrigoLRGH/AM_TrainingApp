import { PartialType } from '@nestjs/mapped-types';
import { CreateRoutineDto } from './create-routine.dto';

// RF-05: editar una rutina — todos los campos de creación, pero opcionales
export class UpdateRoutineDto extends PartialType(CreateRoutineDto) {}