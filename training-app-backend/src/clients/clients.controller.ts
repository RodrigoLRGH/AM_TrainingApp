import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser, type AuthenticatedUser } from '../auth/decorators/current-user.decorator';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';

@Controller('clients')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('INSTRUCTOR')
export class ClientsController {
    constructor(private clientsService: ClientsService) { }

    @Post()
    create(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateClientDto) {
        return this.clientsService.create(user.userId, dto);
    }

    @Get()
    findAll(@CurrentUser() user: AuthenticatedUser) {
        return this.clientsService.findAllForInstructor(user.userId);
    }

    @Patch(':id/activate')
    activate(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
        return this.clientsService.setActive(user.userId, id, true);
    }

    @Patch(':id/deactivate')
    deactivate(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
        return this.clientsService.setActive(user.userId, id, false);
    }
}