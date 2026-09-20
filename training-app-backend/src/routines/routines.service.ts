import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRoutineDto } from './dto/create-routine.dto';
import { UpdateRoutineDto } from './dto/update-routine.dto';
import { AssignTemplateDto } from './dto/assign-template.dto';

@Injectable()
export class RoutinesService {
  constructor(private prisma: PrismaService) { }

  create(instructorId: string, dto: CreateRoutineDto) {
    return this.prisma.routine.create({
      data: {
        title: dto.title,
        date: dto.isTemplate ? null : dto.date ? new Date(dto.date) : null,
        isTemplate: dto.isTemplate ?? false,
        instructorId,
        clientId: dto.isTemplate ? null : dto.clientId,
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
  }

  findAllForInstructor(instructorId: string, isTemplate?: boolean) {
    return this.prisma.routine.findMany({
      where: {
        instructorId,
        ...(isTemplate !== undefined ? { isTemplate } : {}),
      },
      include: { exercises: true, client: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'desc' },
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

    const exercisesToUse = dto.exercises ?? template.exercises;

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
              create: exercisesToUse.map((ex, index) => ({
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

    return created;
  }
}