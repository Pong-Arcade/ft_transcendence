import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { ChatModule } from '../chat/chat.module';
import { GameModule } from '../game/game.module';
import { UserRepository } from './repository/user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from 'src/entity/user.entity';
import { UserService } from './user.service';
import { StatusModule, users } from '../status/status.module';

const repo = {
  provide: 'IUserRepository',
  useClass: UserRepository,
};

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    ChatModule,
    GameModule,
    StatusModule,
  ],
  controllers: [UserController],
  providers: [UserService, repo],
  exports: [UserService],
})
export class UserModule {}
