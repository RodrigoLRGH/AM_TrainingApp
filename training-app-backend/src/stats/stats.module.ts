import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { StatsService } from './stats.service';
import { StatsController } from './stats.controller';

@Module({
  imports: [AuthModule],
  providers: [StatsService],
  controllers: [StatsController],
})
export class StatsModule {}