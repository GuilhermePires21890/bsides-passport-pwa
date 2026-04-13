import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { EmailService } from './email.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private emailService: EmailService,
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

  // Generate and send recovery code
  async sendRecoveryCode(email: string, eventId: string) {
    const attendee = await this.prisma.attendee.findUnique({
      where: { email_eventId: { email, eventId } },
    });

    // Always return success to avoid email enumeration
    if (!attendee) return { success: true };

    // Invalidate previous unused codes
    await this.prisma.recoveryCode.updateMany({
      where: { email, eventId, used: false },
      data: { used: true },
    });

    // Generate 6-char alphanumeric code
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await this.prisma.recoveryCode.create({
      data: { email, eventId, code, expiresAt },
    });

    await this.emailService.sendRecoveryCode(email, code, attendee.name);
    return { success: true };
  }

  // Verify recovery code and return session token
  async verifyRecoveryCode(email: string, eventId: string, code: string) {
    const record = await this.prisma.recoveryCode.findFirst({
      where: {
        email,
        eventId,
        code: code.toUpperCase(),
        used: false,
        expiresAt: { gt: new Date() },
      },
    });

    if (!record) throw new UnauthorizedException('Código inválido ou expirado.');

    // Mark code as used
    await this.prisma.recoveryCode.update({
      where: { id: record.id },
      data: { used: true },
    });

    const attendee = await this.prisma.attendee.findUnique({
      where: { email_eventId: { email, eventId } },
    });

    return { token: attendee.token };
  }

  // Change staff password
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
