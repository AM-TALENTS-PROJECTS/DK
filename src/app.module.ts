import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ContactController } from './contact/contact.controller';
import { ContactService } from './contact/contact.service';
import { EmailService } from './email/email.service';
import { SiteController } from './site/site.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
  ],
  controllers: [SiteController, ContactController],
  providers: [ContactService, EmailService],
})
export class AppModule {}
