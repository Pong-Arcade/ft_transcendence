import { Controller, Get, Logger } from '@nestjs/common';
import { ChatGateway } from './chat.geteway';
import { users } from '../status/status.module';

@Controller('/api/chat')
export class ChatController {
  private logger = new Logger(ChatController.name);

  @Get('test')
  test() {
    this.logger.log('test');
    console.log('asdf');
    console.log(users);
  }
}
