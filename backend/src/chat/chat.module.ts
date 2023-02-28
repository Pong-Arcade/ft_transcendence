import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.geteway';
import { ChatroomController } from './chatroom.controller';
import { ChatroomService } from './chat.service';
import { repo, UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from 'src/entity/user.entity';
@Module({
  imports: [UserModule, TypeOrmModule.forFeature([User])],
  providers: [ChatGateway, ChatroomService, repo],
  exports: [ChatGateway, ChatroomService],
  controllers: [ChatroomController],
})
export class ChatModule {}
