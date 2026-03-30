import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import nodemailer from 'nodemailer';
import { ContactFields } from '../contact/contact.types';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(private readonly config: ConfigService) {}

  async sendContactEmail(formData: ContactFields): Promise<boolean> {
    const smtpHost = this.config.get<string>('SMTP_HOST', 'smtp.gmail.com');
    const smtpPort = Number(this.config.get<string>('SMTP_PORT', '587'));
    const smtpUser = this.config.get<string>('SMTP_USER', '');
    const smtpPassword = this.config.get<string>('SMTP_PASSWORD', '');
    const toEmail = this.config.get<string>('CONTACT_EMAIL', '');
    const fromName = this.config.get<string>('FROM_NAME', 'Diamanté K - Site Web');
    const fromAddr = this.config.get<string>('FROM_EMAIL', smtpUser);

    if (!smtpHost || !smtpUser || !smtpPassword || !toEmail) {
      this.logger.error('SMTP mal configure - verifier les variables SMTP_* et CONTACT_EMAIL');
      return false;
    }

    const transport = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: false,
      auth: {
        user: smtpUser,
        pass: smtpPassword,
      },
    });

    try {
      await transport.sendMail({
        subject: this.buildSubject(formData),
        from: `"${fromName}" <${fromAddr}>`,
        to: toEmail,
        replyTo: formData.email || fromAddr,
        text: this.buildTextBody(formData),
        html: this.buildHtmlBody(formData),
      });

      this.logger.log(`Email contact envoye - evenement: ${formData.type_evenement}`);
      return true;
    } catch (error) {
      this.logger.error(`SMTP erreur envoi - ${(error as Error).name}`);
      return false;
    }
  }

  private buildSubject(data: ContactFields): string {
    return `[Devis Diamante K] ${data.type_evenement || 'Evenement'} - ${data.nom || ''}`;
  }

  private buildTextBody(data: ContactFields): string {
    const lines = [
      'Nouvelle demande de devis - Diamante K',
      '=============================================',
      '',
      `Nom          : ${data.nom || ''}`,
      `Email        : ${data.email || ''}`,
      `Telephone    : ${data.telephone || 'Non renseigne'}`,
      `Evenement    : ${data.type_evenement || ''}`,
      `Date         : ${data.date_evenement || 'Non renseignee'}`,
      `Convives     : ${data.nombre_convives || ''}`,
      '',
      'Message :',
      '------------------------------',
      data.message || 'Aucun message',
      '',
      '=============================================',
      'Envoye depuis diamantektraiteur.com',
    ];

    return lines.join('\n');
  }

  private buildHtmlBody(data: ContactFields): string {
    const messageHtml = this.escapeHtml(data.message || '').replace(/\n/g, '<br>') || '-';

    return `<!DOCTYPE html>
<html lang="fr"><head><meta charset="UTF-8"></head>
<body style="background:#080808;margin:0;padding:32px;font-family:Arial,sans-serif">
<div style="max-width:600px;margin:0 auto;border:1px solid #2a2a2a">
  <div style="background:#c9a96e;padding:24px;text-align:center">
    <h1 style="margin:0;color:#080808;font-size:20px;letter-spacing:.1em">
      DIAMANTE K - NOUVELLE DEMANDE DE DEVIS
    </h1>
  </div>
  <div style="padding:32px;background:#111">
    <table style="width:100%;border-collapse:collapse">
      ${this.row('Nom', data.nom)}
      ${this.row('Email', data.email)}
      ${this.row('Telephone', data.telephone || 'Non renseigne')}
      ${this.row('Evenement', data.type_evenement)}
      ${this.row('Date', data.date_evenement || 'Non renseignee')}
      ${this.row('Convives', data.nombre_convives)}
    </table>
    <div style="margin-top:24px;padding:16px;background:#080808;border-left:3px solid #c9a96e">
      <p style="margin:0 0 8px;color:#999;font-size:11px;text-transform:uppercase;letter-spacing:.1em">Message</p>
      <p style="margin:0;color:#f5f0e8;font-size:14px;line-height:1.7">${messageHtml}</p>
    </div>
  </div>
  <div style="padding:16px;background:#0a0a0a;text-align:center">
    <p style="margin:0;color:#666;font-size:11px">diamantektraiteur.com</p>
  </div>
</div>
</body></html>`;
  }

  private row(label: string, value: string): string {
    const safeValue = this.escapeHtml(value || '-');

    return `<tr>
      <td style="padding:8px 16px;color:#999;font-size:12px;text-transform:uppercase;letter-spacing:.1em;white-space:nowrap">${this.escapeHtml(label)}</td>
      <td style="padding:8px 16px;color:#f5f0e8;font-size:14px">${safeValue}</td>
    </tr>`;
  }

  private escapeHtml(value: string): string {
    return value
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }
}
