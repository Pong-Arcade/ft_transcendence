import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.geteway';
import { ChatroomController } from './chatroom.controller';
@Module({
  providers: [ChatGateway],
  exports: [ChatGateway],
  controllers: [ChatroomController],
})
export class ChatModule {}
