import { Controller, Post, Put, Body, UseGuards, Request } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { IsEmail, IsBoolean, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

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

class ResumeDto {
  @IsString() @MaxLength(100) token: string;
}

class ChangePasswordDto {
  @IsString() currentPassword: string;
  @IsString() newPassword: string;
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Throttle({ default: { ttl: 60000, limit: 5 } })
  @Post('register')
  register(@Body() dto: RegisterAttendeeDto) {
    return this.authService.registerAttendee(dto);
  }

  @Throttle({ default: { ttl: 60000, limit: 10 } })
  @Post('resume')
  resume(@Body() dto: ResumeDto) {
    return this.authService.resumeByToken(dto.token);
  }

  @Throttle({ default: { ttl: 60000, limit: 5 } })
  @Post('staff/login')
  staffLogin(@Body() dto: StaffLoginDto) {
    return this.authService.staffLogin(dto.email, dto.password);
  }

  @Post('staff/create')
  @UseGuards(JwtAuthGuard)
  createStaff(@Body() dto: CreateStaffDto) {
    return this.authService.createStaff(dto.email, dto.password, dto.name);
  }

  @Put('staff/password')
  @UseGuards(JwtAuthGuard)
  changePassword(@Request() req, @Body() dto: ChangePasswordDto) {
    return this.authService.changePassword(req.user.sub, dto.currentPassword, dto.newPassword);
  }
}