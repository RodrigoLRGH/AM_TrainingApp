import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMeasurementDto } from './dto/create-measurement.dto';
import { CreateSessionRatingDto } from './dto/create-session-rating.dto';

@Injectable()
export class TrackingService {
  constructor(private prisma: PrismaService) { }

  createMeasurement(clientId: string, dto: CreateMeasurementDto) {
    return this.prisma.measurement.create({
      data: { clientId, ...dto },
    });
  }

  getMeasurements(clientId: string) {
    return this.prisma.measurement.findMany({
      where: { clientId },
      orderBy: { recordedAt: 'asc' },
    });
  }

  async assertClientBelongsToInstructor(instructorId: string, clientId: string) {
    const client = await this.prisma.user.findUnique({ where: { id: clientId } });
    if (!client || client.role !== 'CLIENTE') {
      throw new NotFoundException('Cliente no encontrado.');
    }
    if (client.instructorId !== instructorId) {
      throw new ForbiddenException('Este cliente no pertenece a tu cuenta.');
    }
  }

  createSessionRating(clientId: string, dto: CreateSessionRatingDto) {
    return this.prisma.sessionRating.create({
      data: { clientId, effort: dto.effort, note: dto.note, routineId: dto.routineId },
    });
  }

  getSessionRatings(clientId: string) {
    return this.prisma.sessionRating.findMany({
      where: { clientId },
      orderBy: { createdAt: 'desc' },
    });
  }
}