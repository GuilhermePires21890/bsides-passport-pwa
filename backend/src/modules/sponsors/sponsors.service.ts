import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SponsorsService {
  constructor(private prisma: PrismaService) {}

  findAll(eventId: string) {
    return this.prisma.sponsor.findMany({
      where: { eventId },
      orderBy: { name: 'asc' },
    });
  }

  findOne(id: string) {
    return this.prisma.sponsor.findUnique({ where: { id } });
  }

  findByQrCode(qrCode: string) {
    return this.prisma.sponsor.findUnique({ where: { qrCode } });
  }

  create(data: { name: string; eventId: string; boothNumber?: string; logoUrl?: string }) {
    return this.prisma.sponsor.create({ data });
  }

  update(id: string, data: { name?: string; boothNumber?: string; logoUrl?: string }) {
    return this.prisma.sponsor.update({ where: { id }, data });
  }

  remove(id: string) {
    return this.prisma.sponsor.delete({ where: { id } });
  }
}
