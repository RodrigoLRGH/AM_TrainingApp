import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser, type AuthenticatedUser } from '../auth/decorators/current-user.decorator';
import { RoutinesService } from './routines.service';
import { CreateRoutineDto } from './dto/create-routine.dto';
import { UpdateRoutineDto } from './dto/update-routine.dto';
import { AssignTemplateDto } from './dto/assign-template.dto';

@Controller('routines')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RoutinesController {
  constructor(private routinesService: RoutinesService) {}

  // RF-04 / RF-24 — instructor crea una rutina o una plantilla
  @Roles('INSTRUCTOR')
  @Post()
  create(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateRoutineDto) {
    return this.routinesService.create(user.userId, dto);
  }

  // Instructor lista sus rutinas/plantillas. ?isTemplate=true para ver solo plantillas
  @Roles('INSTRUCTOR')
  @Get()
  findAllForInstructor(
    @CurrentUser() user: AuthenticatedUser,
    @Query('isTemplate') isTemplate?: string,
  ) {
    const filter = isTemplate === undefined ? undefined : isTemplate === 'true';
    return this.routinesService.findAllForInstructor(user.userId, filter);
  }

  // RF-06 — cliente ve su(s) rutina(s), opcionalmente filtradas por fecha
  @Roles('CLIENTE')
  @Get('me')
  findForClient(@CurrentUser() user: AuthenticatedUser, @Query('date') date?: string) {
    return this.routinesService.findForClient(user.userId, date);
  }

  // RF-05 — editar rutina o plantilla
  @Roles('INSTRUCTOR')
  @Patch(':id')
  update(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() dto: UpdateRoutineDto,
  ) {
    return this.routinesService.update(user.userId, id, dto);
  }

  // RF-05 — eliminar rutina o plantilla
  @Roles('INSTRUCTOR')
  @Delete(':id')
  remove(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.routinesService.remove(user.userId, id);
  }

  // RF-25 / RF-26 — asignar una plantilla a uno o varios clientes
  @Roles('INSTRUCTOR')
  @Post(':id/assign')
  assignTemplate(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() dto: AssignTemplateDto,
  ) {
    return this.routinesService.assignTemplate(user.userId, id, dto);
  }
}