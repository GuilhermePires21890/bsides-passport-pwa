import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { SponsorsService } from './sponsors.service';

@Controller('sponsors')
export class SponsorsController {
  constructor(private sponsorsService: SponsorsService) {}

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

  @Post()
  create(@Body() body: { name: string; eventId: string; boothNumber?: string }) {
    return this.sponsorsService.create(body);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: { name?: string; boothNumber?: string }) {
    return this.sponsorsService.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sponsorsService.remove(id);
  }
}
