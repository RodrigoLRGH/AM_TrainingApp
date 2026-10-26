import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { AuthenticatedUser } from '../decorators/current-user.decorator';

export interface JwtPayload {
    sub: string;
    role: 'INSTRUCTOR' | 'CLIENTE';
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        config: ConfigService,
        private prisma: PrismaService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: config.getOrThrow<string>('JWT_SECRET'),
        });
    }

    async validate(payload: JwtPayload): Promise<AuthenticatedUser> {
        const user = await this.prisma.user.findUnique({
            where: { id: payload.sub },
            select: { role: true, active: true },
        });

        if (!user) {
            throw new UnauthorizedException('Tu sesión ya no es válida.');
        }

        if (user.role === 'CLIENTE' && !user.active) {
            throw new UnauthorizedException('Tu cuenta está desactivada. Contacta a tu instructor.');
        }

        return { userId: payload.sub, role: user.role };
    }
}