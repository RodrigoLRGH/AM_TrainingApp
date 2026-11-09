import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRoutineDto } from './dto/create-routine.dto';
import { UpdateRoutineDto } from './dto/update-routine.dto';
import { AssignTemplateDto } from './dto/assign-template.dto';
import { PushService } from '../push/push.service';

@Injectable()
export class RoutinesService {
  constructor(private prisma: PrismaService, private push: PushService) { }

  async create(instructorId: string, dto: CreateRoutineDto) {
    const isTemplate = dto.isTemplate ?? false;

    if (!isTemplate) {
      if (!dto.clientId) {
        throw new BadRequestException('Indica a qué cliente se asigna la rutina.');
      }
      if (!dto.date) {
        throw new BadRequestException('La rutina debe tener una fecha.');
      }
      // RNF-05: solo se pueden crear rutinas para clientes propios y activos.
      await this.assertOwnActiveClients(instructorId, [dto.clientId]);
    }

    const routine = await this.prisma.routine.create({
      data: {
        title: dto.title,
        date: isTemplate || !dto.date ? null : new Date(dto.date),
        isTemplate,
        instructorId,
        clientId: isTemplate ? null : dto.clientId,
        exercises: {
          create: dto.exercises.map((ex, index) => ({
            name: ex.name,
            sets: ex.sets,
            reps: ex.reps,
            order: index,
          })),
        },
      },
      include: { exercises: true },
    });

    if (!isTemplate && dto.clientId) {
      await this.notifyNewRoutine([dto.clientId], routine.title);
    }

    return routine;
  }

  findAllForInstructor(instructorId: string, isTemplate?: boolean, clientId?: string) {
    return this.prisma.routine.findMany({
      where: {
        instructorId,
        ...(isTemplate !== undefined ? { isTemplate } : {}),
        ...(clientId ? { clientId } : {}),
      },
      include: {
        exercises: { orderBy: { order: 'asc' } },
        client: { select: { id: true, name: true } },
      },
      orderBy: clientId ? { date: 'desc' } : { createdAt: 'desc' },
    });
  }

  findForClient(clientId: string, date?: string) {
    return this.prisma.routine.findMany({
      where: {
        clientId,
        isTemplate: false,
        ...(date ? { date: new Date(date) } : {}),
      },
      include: { exercises: { orderBy: { order: 'asc' } } },
      orderBy: { date: 'asc' },
    });
  }

  private async findOwnedRoutine(instructorId: string, routineId: string) {
    const routine = await this.prisma.routine.findUnique({ where: { id: routineId } });
    if (!routine) throw new NotFoundException('Rutina no encontrada.');
    if (routine.instructorId !== instructorId) {
      throw new ForbiddenException('Esta rutina no pertenece a tu cuenta.');
    }
    return routine;
  }

  async update(instructorId: string, routineId: string, dto: UpdateRoutineDto) {
    await this.findOwnedRoutine(instructorId, routineId);

    return this.prisma.routine.update({
      where: { id: routineId },
      data: {
        ...(dto.title && { title: dto.title }),
        ...(dto.date && { date: new Date(dto.date) }),
        ...(dto.exercises && {
          exercises: {
            deleteMany: {},
            create: dto.exercises.map((ex, index) => ({
              name: ex.name,
              sets: ex.sets,
              reps: ex.reps,
              order: index,
            })),
          },
        }),
      },
      include: { exercises: true },
    });
  }

  async remove(instructorId: string, routineId: string) {
    await this.findOwnedRoutine(instructorId, routineId);
    return this.prisma.routine.delete({ where: { id: routineId } });
  }

  async assignTemplate(instructorId: string, templateId: string, dto: AssignTemplateDto) {
    const template = await this.prisma.routine.findUnique({
      where: { id: templateId },
      include: { exercises: true },
    });

    if (!template || !template.isTemplate) {
      throw new NotFoundException('Plantilla no encontrada.');
    }
    if (template.instructorId !== instructorId) {
      throw new ForbiddenException('Esta plantilla no pertenece a tu cuenta.');
    }

    await this.assertOwnActiveClients(instructorId, dto.clientIds);

    const overrides = new Map((dto.overrides ?? []).map((o) => [o.clientId, o.exercises]));
    for (const clientId of overrides.keys()) {
      if (!dto.clientIds.includes(clientId)) {
        throw new BadRequestException('Hay un ajuste para un cliente que no está seleccionado.');
      }
    }

    const baseExercises = dto.exercises ?? template.exercises;

    const created = await this.prisma.$transaction(
      dto.clientIds.map((clientId) =>
        this.prisma.routine.create({
          data: {
            title: template.title,
            date: new Date(dto.date),
            isTemplate: false,
            instructorId,
            clientId,
            exercises: {
              // RF-26: el ajuste individual no modifica la plantilla original.
              create: (overrides.get(clientId) ?? baseExercises).map((ex, index) => ({
                name: ex.name,
                sets: ex.sets,
                reps: ex.reps,
                order: index,
              })),
            },
          },
          include: { exercises: true },
        }),
      ),
    );

    await this.notifyNewRoutine(dto.clientIds, template.title);

    return created;
  }

  private async assertOwnActiveClients(instructorId: string, clientIds: string[]) {
    const unique = new Set(clientIds);
    const ownClients = await this.prisma.user.count({
      where: { id: { in: [...unique] }, instructorId, role: 'CLIENTE', active: true },
    });
    if (ownClients !== unique.size) {
      throw new ForbiddenException('Solo puedes asignar rutinas a tus clientes activos.');
    }
  }

  private async notifyNewRoutine(clientIds: string[], title: string) {
    const clients = await this.prisma.user.findMany({
      where: { id: { in: clientIds } },
      select: { pushToken: true },
    });

    await this.push.sendToTokens(
      clients.map((c) => c.pushToken),
      'Nueva rutina asignada',
      `Tu instructor te asignó: ${title}`,
      { type: 'routine' },
    );
  }

  async setExerciseCompleted(clientId: string, exerciseId: string, completed: boolean) {
    const exercise = await this.prisma.exercise.findUnique({
      where: { id: exerciseId },
      include: { routine: { select: { clientId: true } } },
    });

    if (!exercise) {
      throw new NotFoundException('Ejercicio no encontrado.');
    }
    if (exercise.routine.clientId !== clientId) {
      throw new ForbiddenException('Este ejercicio no pertenece a tu rutina.');
    }

    return this.prisma.exercise.update({
      where: { id: exerciseId },
      data: { completed },
    });
  }
}
