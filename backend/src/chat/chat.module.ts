import { Module, forwardRef } from '@nestjs/common';
import { ChatGateway } from './chat.geteway';
import { ChatroomController } from './chatroom.controller';
import { ChatroomService } from './chat.service';
import { repo, UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from 'src/entity/user.entity';
@Module({
  imports: [UserModule, TypeOrmModule.forFeature([User])], //forwardRef(() => UserModule)],
  providers: [ChatGateway, ChatroomService, UserService, repo],
  exports: [ChatGateway],
  controllers: [ChatroomController],
})
export class ChatModule {}
