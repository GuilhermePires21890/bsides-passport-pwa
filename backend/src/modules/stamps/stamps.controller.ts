import { Controller, Post, Get, Body, Headers } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { StampsService } from './stamps.service';

@Controller('stamps')
export class StampsController {
  constructor(private stampsService: StampsService) {}

  @Throttle({ default: { ttl: 60000, limit: 120 } })
  @Post('scan')
  scan(@Body() body: { token: string; qrCode: string }) {
    return this.stampsService.scan(body.token, body.qrCode);
  }

  @Throttle({ default: { ttl: 60000, limit: 20 } })
  @Get('passport')
  getPassport(@Headers('x-attendee-token') token: string) {
    return this.stampsService.getPassport(token);
  }
}