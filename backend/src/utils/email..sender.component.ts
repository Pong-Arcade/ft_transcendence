import { MailerService } from '@nestjs-modules/mailer';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailSender {
  private logger = new Logger(EmailSender.name);
  constructor(
    @Inject(ConfigService) private configService: ConfigService,
    private readonly mailerService: MailerService,
  ) {}

  send2FAEmail(email: string, access: string): void {
    this.logger.log(`Called ${this.send2FAEmail.name}`);
    const emailFrom = this.configService.get<string>('email.from');
    this.mailerService
      .sendMail({
        from: `pong arcade <${emailFrom}>`,
        to: email,
        subject: '[pong arcade] 2차 인증 코드',
        template: `./two.factor.email.hbs`,
        context: { access },
      })
      .then((success) => {
        this.logger.log(`Send mail to ${email} success!`);
        this.logger.log(`${email} : ${new Date()} : ${success.response}`);
      })
      .catch((e) => {
        this.logger.error(`Send mail to ${email} failed.. 🥺 ${e}`);
        this.logger.error(`${email} : ${new Date()} : ${e}`);
      });
  }
}
