import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StatsService {
  constructor(private prisma: PrismaService) { }

  async getDashboard(instructorId: string, fromDate?: string, toDate?: string) {
    const from = fromDate ? new Date(fromDate) : new Date(new Date().setDate(new Date().getDate() - 30));
    const to = toDate ? new Date(toDate) : new Date();

    const activeClients = await this.prisma.user.count({
      where: { instructorId, role: 'CLIENTE', active: true },
    });

    const totalClients = await this.prisma.user.count({
      where: { instructorId, role: 'CLIENTE' },
    });

    const attendanceCount = await this.prisma.attendance.count({
      where: { instructorId, date: { gte: from, lte: to } },
    });

    const daysInPeriod = Math.max(
      1,
      Math.ceil((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24)),
    );

    const expectedAttendances = activeClients * daysInPeriod;
    const attendanceRate =
      expectedAttendances > 0 ? Math.round((attendanceCount / expectedAttendances) * 100) : 0;

    const routinesAssigned = await this.prisma.routine.count({
      where: {
        instructorId,
        isTemplate: false,
        createdAt: { gte: from, lte: to },
      },
    });

    const templatesCreated = await this.prisma.routine.count({
      where: {
        instructorId,
        isTemplate: true,
        createdAt: { gte: from, lte: to },
      },
    });

    return {
      period: { from, to },
      clients: { active: activeClients, total: totalClients },
      attendanceRatePercent: attendanceRate,
      routinesAssigned,
      templatesCreated,
    };
  }
}