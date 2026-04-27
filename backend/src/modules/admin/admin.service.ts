import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  private async assertEventExists(eventId: string) {
    const event = await this.prisma.event.findUnique({ where: { id: eventId }, select: { id: true } });
    if (!event) throw new NotFoundException('Evento não encontrado.');
  }

  async getDashboard(eventId: string) {
    await this.assertEventExists(eventId);
    const totalSponsors = await this.prisma.sponsor.count({ where: { eventId } });
    const totalAttendees = await this.prisma.attendee.count({ where: { eventId } });
    const totalStamps = await this.prisma.stamp.count({
      where: { attendee: { eventId } },
    });

    const attendees = await this.prisma.attendee.findMany({
      where: { eventId },
      include: { stamps: true },
    });
    const qualified = attendees.filter(a => a.stamps.length >= totalSponsors);

    return {
      totalSponsors,
      totalAttendees,
      totalStamps,
      totalQualified: qualified.length,
    };
  }

  async getQualifiedList(eventId: string) {
    await this.assertEventExists(eventId);
    const totalSponsors = await this.prisma.sponsor.count({ where: { eventId } });

    const attendees = await this.prisma.attendee.findMany({
      where: { eventId },
      include: { stamps: { include: { sponsor: true } } },
    });

    return attendees
      .filter(a => a.stamps.length >= totalSponsors)
      .map(a => ({
        id: a.id,
        name: a.name,
        email: a.email,
        company: a.company,
        rgpdConsent: a.rgpdConsent,
        qualifiedAt: a.stamps[a.stamps.length - 1]?.scannedAt,
      }));
  }

  async exportCsv(eventId: string) {
    const qualified = await this.getQualifiedList(eventId);
    const withConsent = qualified.filter(a => a.rgpdConsent);

    const header = 'Name,Email,Company,Qualified At\n';
    const rows = withConsent
      .map(a => `"${a.name}","${a.email}","${a.company || ''}","${a.qualifiedAt}"`)
      .join('\n');

    return header + rows;
  }

  async getSponsorScans(eventId: string) {
    await this.assertEventExists(eventId);
    const sponsors = await this.prisma.sponsor.findMany({
      where: { eventId },
      include: { _count: { select: { stamps: true } } },
      orderBy: { name: 'asc' },
    });

    return sponsors.map(s => ({
      id: s.id,
      name: s.name,
      boothNumber: s.boothNumber,
      qrCode: s.qrCode,
      scanCount: s._count.stamps,
    }));
  }
}
