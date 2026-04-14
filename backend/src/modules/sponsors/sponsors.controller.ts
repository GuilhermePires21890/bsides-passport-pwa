import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { SponsorsService } from './sponsors.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('sponsors')
export class SponsorsController {
  constructor(private sponsorsService: SponsorsService) {}

  // Públicos — necessários para o frontend
  @Get()
  findAll(@Query('eventId') eventId: string) {
    return this.sponsorsService.findAll(eventId);
  }

  @Get('qr/:qrCode')
  findByQr(@Param('qrCode') qrCode: string) {
    return this.sponsorsService.findByQrCode(qrCode);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sponsorsService.findOne(id);
  }

  // Protegidos — só staff autenticado
  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() body: { name: string; eventId: string; boothNumber?: string }) {
    return this.sponsorsService.create(body);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() body: { name?: string; boothNumber?: string }) {
    return this.sponsorsService.update(id, body);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.sponsorsService.remove(id);
  }
}