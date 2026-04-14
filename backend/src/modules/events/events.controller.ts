import { Controller, Get, Post, Put, Body, Param, UseGuards } from '@nestjs/common';
import { EventsService } from './events.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('events')
export class EventsController {
  constructor(private eventsService: EventsService) {}

  // Públicos — necessários para o frontend
  @Get('active')
  findActive() {
    return this.eventsService.findActive();
  }

  // Protegidos — só staff autenticado
  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.eventsService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.eventsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() body: { name: string; date: string }) {
    return this.eventsService.create({ name: body.name, date: new Date(body.date) });
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() body: { name?: string; active?: boolean }) {
    return this.eventsService.update(id, body);
  }
}