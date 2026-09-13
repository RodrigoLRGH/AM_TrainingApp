import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { ClientsService } from './clients.service';
import { ClientsController } from './clients.controller';

@Module({
    imports: [AuthModule],
    providers: [ClientsService],
    controllers: [ClientsController],
})
export class ClientsModule { }