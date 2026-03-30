import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { ContactService } from './contact.service';
import { EmailService } from '../email/email.service';
import { ContactPayload } from './contact.types';

@Controller('api')
export class ContactController {
  private readonly contactRateLimit: number;

  constructor(
    private readonly contactService: ContactService,
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
  ) {
    const rateLimitContact = this.configService.get<string>('RATE_LIMIT_CONTACT', '10');
    const parsedLimit = Number.parseInt(rateLimitContact, 10);
    this.contactRateLimit = Number.isNaN(parsedLimit) ? 10 : parsedLimit;
  }

  @Get('csrf-token')
  getCsrfToken(@Req() req: Request, @Res() res: Response): void {
    const token = this.contactService.generateCsrfToken(req.session?._csrf_token);
    req.session._csrf_token = token;

    res.setHeader('Cache-Control', 'no-store');
    res.status(HttpStatus.OK).json({ csrf_token: token });
  }

  @Post('contact')
  @HttpCode(HttpStatus.OK)
  async postContact(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: ContactPayload,
    @Headers('x-csrf-token') csrfToken: string,
  ): Promise<void> {
    const clientIp = req.ip || req.socket.remoteAddress || 'unknown';
    const isLimited = this.contactService.isRateLimited(clientIp, this.contactRateLimit, 60_000);
    if (isLimited) {
      res.status(HttpStatus.TOO_MANY_REQUESTS).json({
        error: 'Trop de requetes. Veuillez patienter avant de reessayer.',
      });
      return;
    }

    const sessionToken = req.session?._csrf_token || '';
    if (!this.contactService.isValidCsrfToken(csrfToken || '', sessionToken)) {
      res.status(HttpStatus.FORBIDDEN).json({ error: 'Requete invalide.' });
      return;
    }

    if (!req.is('application/json')) {
      res.status(HttpStatus.BAD_REQUEST).json({ error: 'Content-Type application/json requis.' });
      return;
    }

    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      res.status(HttpStatus.BAD_REQUEST).json({ error: 'Donnees JSON invalides.' });
      return;
    }

    const validation = this.contactService.validateContactPayload(body);

    if (!validation.valid && validation.isBot) {
      res
        .status(HttpStatus.OK)
        .json({ success: true, message: 'Votre demande a bien ete envoyee.' });
      return;
    }

    if (!validation.valid) {
      res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({ error: 'Donnees invalides.', fields: validation.errors });
      return;
    }

    const sent = await this.emailService.sendContactEmail(validation.fields);

    if (sent) {
      delete req.session._csrf_token;
      res.status(HttpStatus.OK).json({
        success: true,
        message: 'Votre demande a bien ete envoyee. Nous vous repondons sous 24h.',
      });
      return;
    }

    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      error: 'Une erreur technique est survenue. Contactez-nous directement par telephone.',
    });
  }
}
