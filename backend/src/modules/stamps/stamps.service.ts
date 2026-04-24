import { Injectable, ConflictException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class StampsService {
  constructor(private prisma: PrismaService) {}

  private assertTokenValid(attendee: { tokenExpiresAt: Date | null } | null, label = 'Attendee') {
    if (!attendee) throw new NotFoundException(`${label} not found`);
    if (attendee.tokenExpiresAt && attendee.tokenExpiresAt < new Date()) {
      throw new ForbiddenException('Token expirado. Regista-te novamente.');
    }
  }

  async scan(attendeeToken: string, qrCode: string) {
    // Find attendee by session token
    const attendee = await this.prisma.attendee.findUnique({
      where: { token: attendeeToken },
    });
    this.assertTokenValid(attendee);

    // Find sponsor by QR code
    const sponsor = await this.prisma.sponsor.findUnique({
      where: { qrCode },
    });
    if (!sponsor) throw new NotFoundException('Invalid QR code');

    // Prevent duplicate stamps
    const existing = await this.prisma.stamp.findUnique({
      where: { attendeeId_sponsorId: { attendeeId: attendee.id, sponsorId: sponsor.id } },
    });
    if (existing) throw new ConflictException('Stamp already collected');

    // Register stamp
    const stamp = await this.prisma.stamp.create({
      data: { attendeeId: attendee.id, sponsorId: sponsor.id },
      include: { sponsor: true },
    });

    // Check if attendee is now qualified
    const totalSponsors = await this.prisma.sponsor.count({
      where: { eventId: attendee.eventId },
    });
    const totalStamps = await this.prisma.stamp.count({
      where: { attendeeId: attendee.id },
    });

    return {
      stamp,
      sponsorName: sponsor.name,
      qualified: totalStamps >= totalSponsors,
      progress: { collected: totalStamps, total: totalSponsors },
    };
  }

  async getPassport(attendeeToken: string) {
    const attendee = await this.prisma.attendee.findUnique({
      where: { token: attendeeToken },
      include: {
        stamps: { include: { sponsor: true } },
        event: { include: { sponsors: true } },
      },
    });
    this.assertTokenValid(attendee);

    const collectedIds = attendee!.stamps.map(s => s.sponsorId);
    const totalSponsors = attendee!.event.sponsors.length;
    const totalStamps = attendee!.stamps.length;

    return {
      attendee: {
        id: attendee!.id,
        name: attendee!.name,
        // email omitted — not needed in the passport view and reduces exposure
        company: attendee!.company,
      },
      event: { id: attendee!.event.id, name: attendee!.event.name },
      sponsors: attendee!.event.sponsors.map(s => ({
        id: s.id,
        name: s.name,
        boothNumber: s.boothNumber,
        logoUrl: s.logoUrl,
        stamped: collectedIds.includes(s.id),
      })),
      progress: { collected: totalStamps, total: totalSponsors },
      qualified: totalStamps >= totalSponsors,
    };
  }
}
