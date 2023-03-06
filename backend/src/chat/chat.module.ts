import { forwardRef, Module } from '@nestjs/common';
import { ChatGateway } from './chat.geteway';
import { ChatroomController } from './chatroom.controller';
import { ChatroomService } from './chat.service';
import { repo, UserModule } from 'src/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from 'src/entity/user.entity';
import { GameModule } from 'src/game/game.module';
import { StatusModule } from 'src/status/status.module';
@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([User]),
    forwardRef(() => GameModule),
    // forwardRef(() => StatusModule),
  ],
  providers: [ChatGateway, ChatroomService, repo],
  exports: [ChatGateway, ChatroomService],
  controllers: [ChatroomController],
})
export class ChatModule {}
