import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { IsEmail, IsBoolean, IsOptional, IsString, IsUUID } from 'class-validator';

class RegisterAttendeeDto {
  @IsString() name: string;
  @IsEmail() email: string;
  @IsOptional() @IsString() company?: string;
  @IsBoolean() rgpdConsent: boolean;
  @IsUUID() eventId: string;
}

class StaffLoginDto {
  @IsEmail() email: string;
  @IsString() password: string;
}

class CreateStaffDto {
  @IsString() name: string;
  @IsEmail() email: string;
  @IsString() password: string;
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterAttendeeDto) {
    return this.authService.registerAttendee(dto);
  }

  @Get('resume')
  resume(@Query('token') token: string) {
    return this.authService.resumeByToken(token);
  }

  @Post('staff/login')
  staffLogin(@Body() dto: StaffLoginDto) {
    return this.authService.staffLogin(dto.email, dto.password);
  }

  @Post('staff/create')
  createStaff(@Body() dto: CreateStaffDto) {
    return this.authService.createStaff(dto.email, dto.password, dto.name);
  }
}