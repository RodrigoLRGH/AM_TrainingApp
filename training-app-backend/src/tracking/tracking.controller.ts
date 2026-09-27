import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser, type AuthenticatedUser } from '../auth/decorators/current-user.decorator';
import { TrackingService } from './tracking.service';
import { CreateMeasurementDto } from './dto/create-measurement.dto';
import { CreateSessionRatingDto } from './dto/create-session-rating.dto';

@Controller()
@UseGuards(JwtAuthGuard, RolesGuard)
export class TrackingController {
  constructor(private trackingService: TrackingService) { }

  @Roles('CLIENTE')
  @Post('measurements')
  createMeasurement(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateMeasurementDto) {
    return this.trackingService.createMeasurement(user.userId, dto);
  }

  @Roles('CLIENTE')
  @Get('measurements/me')
  getMyMeasurements(@CurrentUser() user: AuthenticatedUser) {
    return this.trackingService.getMeasurements(user.userId);
  }

  @Roles('INSTRUCTOR')
  @Get('clients/:clientId/measurements')
  async getClientMeasurements(
    @CurrentUser() user: AuthenticatedUser,
    @Param('clientId') clientId: string,
  ) {
    await this.trackingService.assertClientBelongsToInstructor(user.userId, clientId);
    return this.trackingService.getMeasurements(clientId);
  }

  @Roles('CLIENTE')
  @Post('session-ratings')
  createSessionRating(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateSessionRatingDto,
  ) {
    return this.trackingService.createSessionRating(user.userId, dto);
  }

  @Roles('INSTRUCTOR')
  @Get('clients/:clientId/session-ratings')
  async getClientSessionRatings(
    @CurrentUser() user: AuthenticatedUser,
    @Param('clientId') clientId: string,
  ) {
    await this.trackingService.assertClientBelongsToInstructor(user.userId, clientId);
    return this.trackingService.getSessionRatings(clientId);
  }
}