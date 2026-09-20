import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { AttendanceService } from './attendance.service';
import { AttendanceController } from './attendance.controller';

@Module({
  imports: [AuthModule],
  providers: [AttendanceService],
  controllers: [AttendanceController],
})
export class AttendanceModule {}