import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.event.findMany({ orderBy: { date: 'desc' } });
  }

  async findActive() {
    const event = await this.prisma.event.findFirst({
      where: { active: true },
      include: { sponsors: { orderBy: { name: 'asc' } } },
    });
    if (!event) throw new NotFoundException('No active event found');
    return event;
  }

  findOne(id: string) {
    return this.prisma.event.findUnique({
      where: { id },
      include: { sponsors: true },
    });
  }

  create(data: { name: string; date: Date }) {
    return this.prisma.event.create({ data });
  }

  update(id: string, data: { name?: string; date?: Date; active?: boolean }) {
    return this.prisma.event.update({ where: { id }, data });
  }
}
