import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AttendeesService {
  constructor(private prisma: PrismaService) {}

  findAll(eventId: string) {
    return this.prisma.attendee.findMany({
      where: { eventId },
      include: { stamps: true },  // inclui stamps completos em vez de _count
      orderBy: { createdAt: 'asc' },
    });
  }

  async findQualified(eventId: string) {
    const totalSponsors = await this.prisma.sponsor.count({ where: { eventId } });

    const attendees = await this.prisma.attendee.findMany({
      where: { eventId },
      include: { stamps: true },
    });

    return attendees.filter(a => a.stamps.length >= totalSponsors);
  }

  findOne(id: string) {
    return this.prisma.attendee.findUnique({
      where: { id },
      include: { stamps: { include: { sponsor: true } } },
    });
  }
}
