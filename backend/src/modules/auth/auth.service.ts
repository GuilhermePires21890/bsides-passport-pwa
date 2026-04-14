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
      return { token: existing.token, attendeeId: existing.id, resumed: true };
    }

    const attendee = await this.prisma.attendee.create({ data });
    return { token: attendee.token, attendeeId: attendee.id, resumed: false };
  }

  async resumeByToken(token: string) {
    const attendee = await this.prisma.attendee.findUnique({ where: { token } });
    if (!attendee) throw new UnauthorizedException('Invalid token');
    return attendee;
  }

  async staffLogin(email: string, password: string) {
    const staff = await this.prisma.staff.findUnique({ where: { email } });
    if (!staff) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(password, staff.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    const payload = { sub: staff.id, email: staff.email, role: 'staff' };
    return { access_token: this.jwt.sign(payload) };
  }

  async createStaff(email: string, password: string, name: string) {
    const hashed = await bcrypt.hash(password, 10);
    return this.prisma.staff.create({ data: { email, password: hashed, name } });
  }

  async changePassword(staffId: string, currentPassword: string, newPassword: string) {
    const staff = await this.prisma.staff.findUnique({ where: { id: staffId } });
    if (!staff) throw new UnauthorizedException('Staff não encontrado.');

    const valid = await bcrypt.compare(currentPassword, staff.password);
    if (!valid) throw new UnauthorizedException('Password actual incorrecta.');

    if (newPassword.length < 8) {
      throw new UnauthorizedException('A nova password deve ter pelo menos 8 caracteres.');
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await this.prisma.staff.update({
      where: { id: staffId },
      data: { password: hashed },
    });

    return { success: true, message: 'Password alterada com sucesso.' };
  }
}