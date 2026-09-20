import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { getPathLength } from 'geolib';
import { PrismaService } from '../prisma/prisma.service';
import { AddPointsDto } from './dto/add-points.dto';

@Injectable()
export class RunningService {
  constructor(private prisma: PrismaService) {}

  startSession(clientId: string) {
    return this.prisma.runSession.create({
      data: { clientId },
    });
  }

  async addPoints(clientId: string, sessionId: string, dto: AddPointsDto) {
    const session = await this.findOwnedSession(clientId, sessionId);

    if (session.endedAt) {
      throw new BadRequestException('Esta sesión ya fue finalizada.');
    }

    const existingCount = await this.prisma.runPoint.count({ where: { runSessionId: sessionId } });

    await this.prisma.runPoint.createMany({
      data: dto.points.map((p, index) => ({
        runSessionId: sessionId,
        latitude: p.latitude,
        longitude: p.longitude,
        timestamp: new Date(p.timestamp),
        order: existingCount + index,
      })),
    });

    return this.prisma.runSession.findUnique({
      where: { id: sessionId },
      include: { points: { orderBy: { order: 'asc' } } },
    });
  }

  async finishSession(clientId: string, sessionId: string) {
    const session = await this.findOwnedSession(clientId, sessionId);

    if (session.endedAt) {
      throw new BadRequestException('Esta sesión ya fue finalizada.');
    }

    const points = await this.prisma.runPoint.findMany({
      where: { runSessionId: sessionId },
      orderBy: { order: 'asc' },
    });

    if (points.length < 2) {
      throw new BadRequestException('No hay suficientes puntos para calcular la ruta.');
    }

    const distanceMeters = getPathLength(
      points.map((p) => ({ latitude: p.latitude, longitude: p.longitude })),
    );

    const endedAt = new Date();
    const durationSeconds = Math.round(
      (endedAt.getTime() - session.startedAt.getTime()) / 1000,
    );

    return this.prisma.runSession.update({
      where: { id: sessionId },
      data: { endedAt, distanceMeters, durationSeconds },
      include: { points: { orderBy: { order: 'asc' } } },
    });
  }

  async findOne(clientId: string, sessionId: string) {
    return this.findOwnedSession(clientId, sessionId, true);
  }

  findAllForClient(clientId: string) {
    return this.prisma.runSession.findMany({
      where: { clientId },
      orderBy: { startedAt: 'desc' },
    });
  }

  private async findOwnedSession(clientId: string, sessionId: string, includePoints = false) {
    const session = await this.prisma.runSession.findUnique({
      where: { id: sessionId },
      include: includePoints ? { points: { orderBy: { order: 'asc' } } } : undefined,
    });

    if (!session) throw new NotFoundException('Sesión de correr no encontrada.');
    if (session.clientId !== clientId) {
      throw new ForbiddenException('Esta sesión no te pertenece.');
    }

    return session;
  }
}