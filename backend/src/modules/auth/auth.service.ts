import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import sanitizeHtml = require('sanitize-html');

const sanitize = (value: string): string =>
  sanitizeHtml(value, { allowedTags: [], allowedAttributes: {} }).trim();

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
    const name = sanitize(data.name);
    const email = data.email.toLowerCase().trim();
    const company = data.company ? sanitize(data.company) : undefined;

    if (!name) throw new BadRequestException('Nome inválido.');
    if (name.length > 100) throw new BadRequestException('Nome demasiado longo.');
    if (company && company.length > 100) throw new BadRequestException('Empresa demasiado longa.');

    const existing = await this.prisma.attendee.findUnique({
      where: { email_eventId: { email, eventId: data.eventId } },
    });

    if (existing) {
      return { token: existing.token, attendeeId: existing.id, resumed: true };
    }

    const attendee = await this.prisma.attendee.create({
      data: { ...data, name, email, company },
    });
    return { token: attendee.token, attendeeId: attendee.id, resumed: false };
  }

  async resumeByToken(token: string) {
    if (!token || token.length > 100) throw new UnauthorizedException('Token inválido.');
    const attendee = await this.prisma.attendee.findUnique({ where: { token } });
    if (!attendee) throw new UnauthorizedException('Token inválido.');
    return attendee;
  }

  async staffLogin(email: string, password: string) {
    const staff = await this.prisma.staff.findUnique({
      where: { email: email.toLowerCase().trim() },
    });
    if (!staff) throw new UnauthorizedException('Credenciais inválidas.');

    const valid = await bcrypt.compare(password, staff.password);
    if (!valid) throw new UnauthorizedException('Credenciais inválidas.');

    const payload = { sub: staff.id, email: staff.email, role: 'staff' };
    return { access_token: this.jwt.sign(payload) };
  }

  async createStaff(email: string, password: string, name: string) {
    const sanitizedName = sanitize(name);
    const sanitizedEmail = email.toLowerCase().trim();

    if (!sanitizedName) throw new BadRequestException('Nome inválido.');
    if (password.length < 8) throw new BadRequestException('Password demasiado curta.');

    const hashed = await bcrypt.hash(password, 10);
    return this.prisma.staff.create({
      data: { email: sanitizedEmail, password: hashed, name: sanitizedName },
    });
  }

  async changePassword(staffId: string, currentPassword: string, newPassword: string) {
    const staff = await this.prisma.staff.findUnique({ where: { id: staffId } });
    if (!staff) throw new UnauthorizedException('Staff não encontrado.');

    const valid = await bcrypt.compare(currentPassword, staff.password);
    if (!valid) throw new UnauthorizedException('Password actual incorrecta.');

    if (newPassword.length < 8) {
      throw new BadRequestException('A nova password deve ter pelo menos 8 caracteres.');
    }

    if (newPassword === currentPassword) {
      throw new BadRequestException('A nova password não pode ser igual à actual.');
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await this.prisma.staff.update({
      where: { id: staffId },
      data: { password: hashed },
    });

    return { success: true, message: 'Password alterada com sucesso.' };
  }
}