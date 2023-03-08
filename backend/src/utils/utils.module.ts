import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import MailerConfigService from 'src/config/mailer.config';
import { EmailSender } from './email..sender.component';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useClass: MailerConfigService,
    }),
  ],
  providers: [EmailSender],
  exports: [EmailSender],
})
export class UtilsModule {}
