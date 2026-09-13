import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterInstructorDto } from './dto/register-instructor.dto';
import { LoginInstructorDto } from './dto/login-instructor.dto';
import { LoginClientDto } from './dto/login-client.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('instructor/register')
  registerInstructor(@Body() dto: RegisterInstructorDto) {
    return this.authService.registerInstructor(dto);
  }

  @Post('instructor/login')
  @HttpCode(HttpStatus.OK)
  loginInstructor(@Body() dto: LoginInstructorDto) {
    return this.authService.loginInstructor(dto);
  }

  @Post('client/login')
  @HttpCode(HttpStatus.OK)
  loginClient(@Body() dto: LoginClientDto) {
    return this.authService.loginClient(dto);
  }
}