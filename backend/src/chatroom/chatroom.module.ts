import { Module } from '@nestjs/common';
import { Room } from './chatroom.entity';
import { ChatroomGateway } from './chatroom.gateway';


@Module({
  providers: [ChatroomGateway]
})
export class ChatroomModule {}
