import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { ChatModule } from '../chat/chat.module';
import { GameModule } from '../game/game.module';
import { UserRepository } from './repository/user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from 'src/entity/user.entity';
import { UserService } from './user.service';
import { StatusModule } from '../status/status.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

const repo = {
  provide: 'IUserRepository',
  useClass: UserRepository,
};

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.secret'),
        signOptions: {
          expiresIn: configService.get<string>('jwt.expiresIn'),
        },
      }),
      inject: [ConfigService],
    }),
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
