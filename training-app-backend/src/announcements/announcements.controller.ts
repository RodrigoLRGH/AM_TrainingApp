import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser, type AuthenticatedUser } from '../auth/decorators/current-user.decorator';
import { AnnouncementsService } from './announcements.service';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { RegisterPushTokenDto } from './dto/register-push-token.dto';

@Controller()
@UseGuards(JwtAuthGuard, RolesGuard)
export class AnnouncementsController {
  constructor(private announcementsService: AnnouncementsService) {}

  @Post('push-token')
  registerPushToken(@CurrentUser() user: AuthenticatedUser, @Body() dto: RegisterPushTokenDto) {
    return this.announcementsService.registerPushToken(user.userId, dto);
  }

  @Roles('INSTRUCTOR')
  @Post('announcements')
  create(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateAnnouncementDto) {
    return this.announcementsService.create(user.userId, dto);
  }

  @Roles('INSTRUCTOR')
  @Get('announcements')
  findForInstructor(@CurrentUser() user: AuthenticatedUser) {
    return this.announcementsService.findForInstructor(user.userId);
  }

  @Roles('CLIENTE')
  @Get('announcements/me')
  findForClient(@CurrentUser() user: AuthenticatedUser) {
    return this.announcementsService.findForClient(user.userId);
  }
}