import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.geteway';
import { ChatController } from './chat.controller';
@Module({
  providers: [ChatGateway],
  controllers: [ChatController],
})
export class ChatModule {}
