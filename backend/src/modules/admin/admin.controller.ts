import { Controller, Get, Query, Res, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Response } from 'express';

@Controller('admin')
@UseGuards(JwtAuthGuard)
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('dashboard')
  getDashboard(@Query('eventId') eventId: string) {
    return this.adminService.getDashboard(eventId);
  }

  @Get('qualified')
  getQualified(@Query('eventId') eventId: string) {
    return this.adminService.getQualifiedList(eventId);
  }

  @Get('export')
  async exportCsv(@Query('eventId') eventId: string, @Res() res: Response) {
    const csv = await this.adminService.exportCsv(eventId);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="qualified-attendees.csv"');
    res.send(csv);
  }

  @Get('sponsors/scans')
  getSponsorScans(@Query('eventId') eventId: string) {
    return this.adminService.getSponsorScans(eventId);
  }
}