import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { AttendeesService } from './attendees.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('attendees')
@UseGuards(JwtAuthGuard)
export class AttendeesController {
  constructor(private attendeesService: AttendeesService) {}

  @Get()
  findAll(@Query('eventId') eventId: string) {
    return this.attendeesService.findAll(eventId);
  }

  @Get('qualified')
  findQualified(@Query('eventId') eventId: string) {
    return this.attendeesService.findQualified(eventId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.attendeesService.findOne(id);
  }
}