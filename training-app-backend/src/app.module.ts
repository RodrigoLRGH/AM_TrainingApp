import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ClientsModule } from './clients/clients.module';
import { RoutinesModule } from './routines/routines.module';
import { AttendanceModule } from './attendance/attendance.module';
import { RunningModule } from './running/running.module';
import { TrackingModule } from './tracking/tracking.module';
import { PushModule } from './push/push.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    ClientsModule,
    RoutinesModule,
    AttendanceModule,
    RunningModule,
    TrackingModule,
    PushModule,
  ],
})
export class AppModule {}