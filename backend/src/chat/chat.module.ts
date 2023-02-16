import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.geteway';
import { ChatroomController } from './chatroom.controller';
import { ChatroomService } from './chat.service';
@Module({
  providers: [ChatGateway, ChatroomService],
  exports: [ChatGateway],
  controllers: [ChatroomController],
})
export class ChatModule {}
