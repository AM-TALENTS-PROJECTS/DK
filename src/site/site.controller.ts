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

  @Get('/sitemap.xml')
  sitemap(@Res() res: Response): void {
    res.sendFile(resolveRootFile('sitemap.xml'));
  }

  @Get('/robots.txt')
  robots(@Res() res: Response): void {
    res.sendFile(resolveRootFile('robots.txt'));
  }
}
