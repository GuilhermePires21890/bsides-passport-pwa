import { Controller, Get, Query, Res } from '@nestjs/common';
import { AdminService } from './admin.service';
import { Response } from 'express';

@Controller('admin')
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
