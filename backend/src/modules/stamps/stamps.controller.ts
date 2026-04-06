import { Controller, Post, Get, Body, Query } from '@nestjs/common';
import { StampsService } from './stamps.service';

@Controller('stamps')
export class StampsController {
  constructor(private stampsService: StampsService) {}

  // POST /api/stamps/scan — called when attendee scans a QR
  @Post('scan')
  scan(@Body() body: { token: string; qrCode: string }) {
    return this.stampsService.scan(body.token, body.qrCode);
  }

  // GET /api/stamps/passport?token=xxx — returns full passport state
  @Get('passport')
  getPassport(@Query('token') token: string) {
    return this.stampsService.getPassport(token);
  }
}
