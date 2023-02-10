import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { ChatModule } from '../chat/chat.module';
import { GameModule } from '../game/game.module';

@Module({
  imports: [ChatModule, GameModule],
  controllers: [UserController],
})
export class UserModule {}
