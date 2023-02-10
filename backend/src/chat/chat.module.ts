import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.geteway';
@Module({
  providers: [ChatGateway],
  exports: [ChatGateway],
})
export class ChatModule {}
