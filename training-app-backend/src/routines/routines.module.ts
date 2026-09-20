import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { RoutinesService } from './routines.service';
import { RoutinesController } from './routines.controller';

@Module({
  imports: [AuthModule],
  providers: [RoutinesService],
  controllers: [RoutinesController],
})
export class RoutinesModule {}