import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { isPointWithinRadius } from 'geolib';
import { PrismaService } from '../prisma/prisma.service';
import { SetGymLocationDto } from './dto/set-gym-location.dto';
import { CheckinGeoDto } from './dto/checkin-geo.dto';
import { CheckinQrDto } from './dto/checkin-qr.dto';

@Injectable()
export class AttendanceService {
  constructor(private prisma: PrismaService) {}

  setGymLocation(instructorId: string, dto: SetGymLocationDto) {
    return this.prisma.user.update({
      where: { id: instructorId },
      data: {
        gymLatitude: dto.latitude,
        gymLongitude: dto.longitude,
        gymRadiusMeters: dto.radiusMeters,
      },
      select: { id: true, gymLatitude: true, gymLongitude: true, gymRadiusMeters: true },
    });
  }

  async generateGymQrCode(instructorId: string) {
    const qrCode = `GYM-${instructorId.slice(0, 8)}-${Date.now().toString(36).toUpperCase()}`;
    return this.prisma.user.update({
      where: { id: instructorId },
      data: { gymQrCode: qrCode },
      select: { id: true, gymQrCode: true },
    });
  }

  async checkinGeo(clientId: string, dto: CheckinGeoDto) {
    const client = await this.prisma.user.findUnique({ where: { id: clientId } });
    if (!client?.instructorId) {
      throw new NotFoundException('Este cliente no tiene un instructor asignado.');
    }

    const instructor = await this.prisma.user.findUnique({
      where: { id: client.instructorId },
    });

    if (!instructor?.gymLatitude || !instructor.gymLongitude || !instructor.gymRadiusMeters) {
      throw new BadRequestException('Tu instructor todavía no configuró la ubicación del gimnasio.');
    }

    const withinRadius = isPointWithinRadius(
      { latitude: dto.latitude, longitude: dto.longitude },
      { latitude: instructor.gymLatitude, longitude: instructor.gymLongitude },
      instructor.gymRadiusMeters,
    );

    if (!withinRadius) {
      throw new BadRequestException('No estás dentro del radio del gimnasio.');
    }

    await this.assertNoDuplicateToday(clientId);

    return this.prisma.attendance.create({
      data: {
        method: 'GEO',
        clientId,
        instructorId: instructor.id,
      },
    });
  }

  async checkinQr(clientId: string, dto: CheckinQrDto) {
    const instructor = await this.prisma.user.findUnique({
      where: { gymQrCode: dto.qrCode },
    });

    if (!instructor) {
      throw new NotFoundException('Código QR no reconocido.');
    }

    const client = await this.prisma.user.findUnique({ where: { id: clientId } });
    if (client?.instructorId !== instructor.id) {
      throw new BadRequestException('Este QR pertenece a otro instructor.');
    }

    await this.assertNoDuplicateToday(clientId);

    return this.prisma.attendance.create({
      data: {
        method: 'QR',
        clientId,
        instructorId: instructor.id,
      },
    });
  }

  getCalendar(instructorId: string, clientId?: string) {
    return this.prisma.attendance.findMany({
      where: {
        instructorId,
        ...(clientId ? { clientId } : {}),
      },
      include: { client: { select: { id: true, name: true } } },
      orderBy: { date: 'desc' },
    });
  }

  private async assertNoDuplicateToday(clientId: string) {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const existing = await this.prisma.attendance.findFirst({
      where: { clientId, date: { gte: startOfDay, lte: endOfDay } },
    });

    if (existing) {
      throw new ConflictException('Ya registraste tu asistencia hoy.');
    }
  }
}