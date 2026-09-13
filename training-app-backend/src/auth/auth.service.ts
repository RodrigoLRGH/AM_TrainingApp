import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterInstructorDto } from './dto/register-instructor.dto';
import { LoginInstructorDto } from './dto/login-instructor.dto';
import { LoginClientDto } from './dto/login-client.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) { }

  async registerInstructor(dto: RegisterInstructorDto) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) {
      throw new ConflictException('Ya existe una cuenta con ese correo electrónico.');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const instructor = await this.prisma.user.create({
      data: {
        role: 'INSTRUCTOR',
        name: dto.name,
        email: dto.email,
        password: hashedPassword,
      },
    });

    return this.buildAuthResponse(instructor.id, 'INSTRUCTOR', instructor.name);
  }

  async loginInstructor(dto: LoginInstructorDto) {
    const instructor = await this.prisma.user.findUnique({
      where: { email: dto.email, role: 'INSTRUCTOR' },
    });

    if (!instructor || !instructor.password) {
      throw new UnauthorizedException('Correo o contraseña incorrectos.');
    }

    const passwordMatches = await bcrypt.compare(dto.password, instructor.password);
    if (!passwordMatches) {
      throw new UnauthorizedException('Correo o contraseña incorrectos.');
    }

    return this.buildAuthResponse(instructor.id, 'INSTRUCTOR', instructor.name);
  }

  async loginClient(dto: LoginClientDto) {
    const client = await this.prisma.user.findUnique({
      where: { clientCode: dto.clientCode, role: 'CLIENTE' },
    });

    if (!client) {
      throw new NotFoundException('Código de cliente no encontrado.');
    }

    if (!client.active) {
      throw new UnauthorizedException('Tu cuenta está desactivada. Contacta a tu instructor.');
    }

    return this.buildAuthResponse(client.id, 'CLIENTE', client.name);
  }

  private buildAuthResponse(userId: string, role: 'INSTRUCTOR' | 'CLIENTE', name: string) {
    const accessToken = this.jwt.sign({ sub: userId, role });
    return {
      accessToken,
      user: { id: userId, role, name },
    };
  }
}