import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { RunningService } from './running.service';
import { RunningController } from './running.controller';

@Module({
  imports: [AuthModule],
  providers: [RunningService],
  controllers: [RunningController],
})
export class RunningModule {}