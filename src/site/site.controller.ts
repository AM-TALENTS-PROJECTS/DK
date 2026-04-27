import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import * as path from 'path';
import { resolveFrontendDir, resolveRootFile } from './runtime-paths';

@Controller()
export class SiteController {
  private readonly frontendDir = resolveFrontendDir();

  @Get('/')
  index(@Res() res: Response): void {
    res.sendFile(path.join(this.frontendDir, 'index.html'));
  }

  @Get('/mentions-legales')
  mentionsLegales(@Res() res: Response): void {
    res.sendFile(path.join(this.frontendDir, 'mentions-legales.html'));
  }

  @Get('/politique-confidentialite')
  politiqueConfidentialite(@Res() res: Response): void {
    res.sendFile(path.join(this.frontendDir, 'politique-confidentialite.html'));
  }

  @Get('/cgv')
  cgv(@Res() res: Response): void {
    res.sendFile(path.join(this.frontendDir, 'cgv.html'));
  }

  @Get('/galerie')
  galerie(@Res() res: Response): void {
    res.sendFile(path.join(this.frontendDir, 'galerie.html'));
  }

  @Get('/nos-prestations')
  nosPrestations(@Res() res: Response): void {
    res.sendFile(path.join(this.frontendDir, 'nos-prestations.html'));
  }

  @Get('/notre-histoire')
  notreHistoire(@Res() res: Response): void {
    res.sendFile(path.join(this.frontendDir, 'notre-histoire.html'));
  }

  @Get('/avis')
  avis(@Res() res: Response): void {
    res.sendFile(path.join(this.frontendDir, 'avis.html'));
  }

  @Get('/contact')
  contact(@Res() res: Response): void {
    res.sendFile(path.join(this.frontendDir, 'contact.html'));
  }

  @Get('/404')
  notFound(@Res() res: Response): void {
    res.sendFile(path.join(this.frontendDir, '404.html'));
  }

  @Get('/sitemap.xml')
  sitemap(@Res() res: Response): void {
    res.sendFile(resolveRootFile('sitemap.xml'));
  }

  @Get('/robots.txt')
  robots(@Res() res: Response): void {
    res.sendFile(resolveRootFile('robots.txt'));
  }
}
