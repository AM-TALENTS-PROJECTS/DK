import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { json } from 'express';
import session from 'express-session';
import helmet from 'helmet';
import * as path from 'path';
import { AppModule } from './app.module';
import { resolveFrontendDir } from './site/runtime-paths';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const config = app.get(ConfigService);

  const isProd = config.get<string>('NODE_ENV', 'development') === 'production';
  const frontendDir = resolveFrontendDir();

  const expressApp = app.getHttpAdapter().getInstance();
  expressApp.set('trust proxy', 1);
  app.disable('x-powered-by');
  app.use(json({ limit: '100kb' }));

  app.use(
    session({
      name: 'diamantek.sid',
      secret: config.get<string>('SESSION_SECRET', 'dev-only-change-in-production'),
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: isProd,
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60 * 4,
      },
    }),
  );

  app.use((req, res, next) => {
    if (!isProd) {
      next();
      return;
    }

    const forwardedProto = req.header('x-forwarded-proto');
    if (forwardedProto === 'http') {
      res.redirect(301, `https://${req.headers.host}${req.originalUrl}`);
      return;
    }

    next();
  });

  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", 'cdnjs.cloudflare.com', 'cdn.jsdelivr.net'],
          styleSrc: ["'self'", 'fonts.googleapis.com', 'cdnjs.cloudflare.com'],
          fontSrc: ['fonts.gstatic.com', 'cdnjs.cloudflare.com'],
          imgSrc: ["'self'", 'data:', 'www.google.com', 'www.gstatic.com'],
          connectSrc: ["'self'", 'api.emailjs.com'],
          frameAncestors: ["'none'"],
        },
      },
      frameguard: { action: 'deny' },
      referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
      hsts: isProd
        ? {
            maxAge: 31536000,
            includeSubDomains: true,
            preload: true,
          }
        : false,
    }),
  );

  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
    next();
  });

  app.useStaticAssets(frontendDir);

  await app.init();

  expressApp.use((req, res, next) => {
    if (req.path.startsWith('/api')) {
      next();
      return;
    }

    res.sendFile(path.join(frontendDir, 'index.html'));
  });

  const port = Number(config.get<string>('PORT', '5000'));
  await app.listen(port, '0.0.0.0');
}

bootstrap();
