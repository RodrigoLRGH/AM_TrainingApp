import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateClientDto } from './dto/create-client.dto';

@Injectable()
export class ClientsService {
    constructor(private prisma: PrismaService) { }

    async create(instructorId: string, dto: CreateClientDto) {
        const clientCode = await this.generateUniqueClientCode();

        return this.prisma.user.create({
            data: {
                role: 'CLIENTE',
                name: dto.name,
                clientCode,
                instructorId,
            },
            select: { id: true, name: true, clientCode: true, active: true, createdAt: true },
        });
    }

    findAllForInstructor(instructorId: string) {
        return this.prisma.user.findMany({
            where: { instructorId, role: 'CLIENTE' },
            select: { id: true, name: true, clientCode: true, active: true, createdAt: true },
            orderBy: { createdAt: 'desc' },
        });
    }

    async setActive(instructorId: string, clientId: string, active: boolean) {
        const client = await this.prisma.user.findUnique({ where: { id: clientId } });

        if (!client || client.role !== 'CLIENTE') {
            throw new NotFoundException('Cliente no encontrado.');
        }
        if (client.instructorId !== instructorId) {
            throw new ForbiddenException('Este cliente no pertenece a tu cuenta.');
        }

        return this.prisma.user.update({
            where: { id: clientId },
            data: { active },
            select: { id: true, name: true, clientCode: true, active: true },
        });
    }

    private async generateUniqueClientCode(): Promise<string> {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        for (let attempt = 0; attempt < 10; attempt++) {
            let code = '';
            for (let i = 0; i < 6; i++) {
                code += chars[Math.floor(Math.random() * chars.length)];
            }
            const exists = await this.prisma.user.findUnique({ where: { clientCode: code } });
            if (!exists) return code;
        }
        throw new Error('No se pudo generar un código único, intenta de nuevo.');
    }
}