import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PushService } from '../push/push.service';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { RegisterPushTokenDto } from './dto/register-push-token.dto';

@Injectable()
export class AnnouncementsService {
  constructor(
    private prisma: PrismaService,
    private push: PushService,
  ) {}

  registerPushToken(userId: string, dto: RegisterPushTokenDto) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { pushToken: dto.pushToken },
      select: { id: true, pushToken: true },
    });
  }

  async create(instructorId: string, dto: CreateAnnouncementDto) {
    const announcement = await this.prisma.announcement.create({
      data: { title: dto.title, message: dto.message, instructorId },
    });

    const clients = await this.prisma.user.findMany({
      where: { instructorId, role: 'CLIENTE', active: true },
      select: { pushToken: true },
    });

    await this.push.sendToTokens(
      clients.map((c) => c.pushToken),
      dto.title,
      dto.message,
    );

    return announcement;
  }

  async findForClient(clientId: string) {
    const client = await this.prisma.user.findUnique({ where: { id: clientId } });
    if (!client?.instructorId) return [];

    return this.prisma.announcement.findMany({
      where: { instructorId: client.instructorId },
      orderBy: { createdAt: 'desc' },
    });
  }

  findForInstructor(instructorId: string) {
    return this.prisma.announcement.findMany({
      where: { instructorId },
      orderBy: { createdAt: 'desc' },
    });
  }
}