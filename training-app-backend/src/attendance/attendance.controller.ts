import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser, type AuthenticatedUser } from '../auth/decorators/current-user.decorator';
import { AttendanceService } from './attendance.service';
import { SetGymLocationDto } from './dto/set-gym-location.dto';
import { CheckinGeoDto } from './dto/checkin-geo.dto';
import { CheckinQrDto } from './dto/checkin-qr.dto';

@Controller('attendance')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AttendanceController {
  constructor(private attendanceService: AttendanceService) {}

  @Roles('INSTRUCTOR')
  @Post('gym-location')
  setGymLocation(@CurrentUser() user: AuthenticatedUser, @Body() dto: SetGymLocationDto) {
    return this.attendanceService.setGymLocation(user.userId, dto);
  }

  @Roles('INSTRUCTOR')
  @Post('gym-qr')
  generateGymQrCode(@CurrentUser() user: AuthenticatedUser) {
    return this.attendanceService.generateGymQrCode(user.userId);
  }

  @Roles('CLIENTE')
  @Post('checkin/geo')
  checkinGeo(@CurrentUser() user: AuthenticatedUser, @Body() dto: CheckinGeoDto) {
    return this.attendanceService.checkinGeo(user.userId, dto);
  }

  @Roles('CLIENTE')
  @Post('checkin/qr')
  checkinQr(@CurrentUser() user: AuthenticatedUser, @Body() dto: CheckinQrDto) {
    return this.attendanceService.checkinQr(user.userId, dto);
  }

  @Roles('INSTRUCTOR')
  @Get('calendar')
  getCalendar(@CurrentUser() user: AuthenticatedUser, @Query('clientId') clientId?: string) {
    return this.attendanceService.getCalendar(user.userId, clientId);
  }
}