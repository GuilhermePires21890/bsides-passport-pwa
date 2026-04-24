import { Controller, Get, Query, Res, UseGuards, BadRequestException } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Throttle } from '@nestjs/throttler';
import { Response } from 'express';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function assertValidEventId(eventId: string) {
  if (!eventId || !UUID_RE.test(eventId)) throw new BadRequestException('eventId inválido.');
}

@Controller('admin')
@UseGuards(JwtAuthGuard)
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('dashboard')
  getDashboard(@Query('eventId') eventId: string) {
    assertValidEventId(eventId);
    return this.adminService.getDashboard(eventId);
  }

  @Get('qualified')
  getQualified(@Query('eventId') eventId: string) {
    assertValidEventId(eventId);
    return this.adminService.getQualifiedList(eventId);
  }

  @Throttle({ default: { ttl: 60000, limit: 2 } })
  @Get('export')
  async exportCsv(@Query('eventId') eventId: string, @Res() res: Response) {
    assertValidEventId(eventId);
    const csv = await this.adminService.exportCsv(eventId);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="qualified-attendees.csv"');
    res.send(csv);
  }

  @Get('sponsors/scans')
  getSponsorScans(@Query('eventId') eventId: string) {
    assertValidEventId(eventId);
    return this.adminService.getSponsorScans(eventId);
  }
}