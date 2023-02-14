import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.geteway';
import { ChatController } from './chat.controller';
@Module({
  providers: [ChatGateway],
  exports: [ChatGateway],
  controllers: [ChatController],
})
export class ChatModule {}
