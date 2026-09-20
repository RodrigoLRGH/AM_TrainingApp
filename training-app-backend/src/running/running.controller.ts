import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser, type AuthenticatedUser } from '../auth/decorators/current-user.decorator';
import { RunningService } from './running.service';
import { AddPointsDto } from './dto/add-points.dto';

@Controller('running')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('CLIENTE')
export class RunningController {
  constructor(private runningService: RunningService) {}

  @Post('start')
  start(@CurrentUser() user: AuthenticatedUser) {
    return this.runningService.startSession(user.userId);
  }

  @Post(':id/points')
  addPoints(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() dto: AddPointsDto,
  ) {
    return this.runningService.addPoints(user.userId, id, dto);
  }

  @Post(':id/finish')
  finish(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.runningService.finishSession(user.userId, id);
  }

  @Get(':id')
  findOne(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.runningService.findOne(user.userId, id);
  }

  @Get()
  findAll(@CurrentUser() user: AuthenticatedUser) {
    return this.runningService.findAllForClient(user.userId);
  }
}