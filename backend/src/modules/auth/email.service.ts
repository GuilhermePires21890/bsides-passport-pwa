import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
  private resend: Resend;

  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY);
  }

  async sendRecoveryCode(email: string, code: string, name: string) {
    await this.resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: `[BSides Porto 2026] O teu código de acesso: ${code}`,
      html: `
        <div style="background:#000;color:#fff;font-family:monospace;padding:40px;max-width:480px;margin:0 auto;">
          <p style="color:#00FF41;font-size:12px;letter-spacing:4px;margin-bottom:8px;">[ PASSPORT BSIDES PORTO ]</p>
          <h1 style="font-size:24px;margin-bottom:4px;">Olá, ${name}!</h1>
          <p style="color:#888;margin-bottom:32px;">BSides Porto 2026 — Recuperação de sessão</p>
          
          <p style="color:#888;font-size:13px;margin-bottom:8px;">O teu código de acesso é:</p>
          <div style="background:#1A1A1A;border:2px solid #00FF41;border-radius:8px;padding:24px;text-align:center;box-shadow:0 0 20px #00FF4133;margin-bottom:24px;">
            <span style="color:#00FF41;font-size:40px;font-weight:bold;letter-spacing:12px;">${code}</span>
          </div>
          
          <p style="color:#888;font-size:12px;">⚠ Este código expira em <strong style="color:#fff;">10 minutos</strong>.</p>
          <p style="color:#888;font-size:12px;">Se não pediste este código, ignora este email.</p>
          
          <hr style="border-color:#2A2A2A;margin:32px 0;">
          <p style="color:#444;font-size:11px;text-align:center;">BSides Porto 2026 · 26-27 Junho · ISEP, Porto</p>
        </div>
      `,
    });
  }
}