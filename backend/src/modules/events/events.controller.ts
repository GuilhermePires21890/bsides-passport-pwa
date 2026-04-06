import { Controller, Get, Post, Put, Body, Param } from '@nestjs/common';
import { EventsService } from './events.service';

@Controller('events')
export class EventsController {
  constructor(private eventsService: EventsService) {}

  @Get()
  findAll() {
    return this.eventsService.findAll();
  }

  @Get('active')
  findActive() {
    return this.eventsService.findActive();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventsService.findOne(id);
  }

  @Post()
  create(@Body() body: { name: string; date: string }) {
    return this.eventsService.create({ name: body.name, date: new Date(body.date) });
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: { name?: string; active?: boolean }) {
    return this.eventsService.update(id, body);
  }
}
