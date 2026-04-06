import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  // Attendee registration — returns session token
  async registerAttendee(data: {
    name: string;
    email: string;
    company?: string;
    rgpdConsent: boolean;
    eventId: string;
  }) {
    const existing = await this.prisma.attendee.findUnique({
      where: { email_eventId: { email: data.email, eventId: data.eventId } },
    });

    if (existing) {
      // Return existing token so attendee can resume session
      return { token: existing.token, attendeeId: existing.id, resumed: true };
    }

    const attendee = await this.prisma.attendee.create({ data });
    return { token: attendee.token, attendeeId: attendee.id, resumed: false };
  }

  // Attendee session recovery by token
  async resumeByToken(token: string) {
    const attendee = await this.prisma.attendee.findUnique({ where: { token } });
    if (!attendee) throw new UnauthorizedException('Invalid token');
    return attendee;
  }

  // Staff login
  async staffLogin(email: string, password: string) {
    const staff = await this.prisma.staff.findUnique({ where: { email } });
    if (!staff) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(password, staff.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    const payload = { sub: staff.id, email: staff.email, role: 'staff' };
    return { access_token: this.jwt.sign(payload) };
  }

  // Seed first staff account (run once)
  async createStaff(email: string, password: string, name: string) {
    const hashed = await bcrypt.hash(password, 10);
    return this.prisma.staff.create({ data: { email, password: hashed, name } });
  }
}
