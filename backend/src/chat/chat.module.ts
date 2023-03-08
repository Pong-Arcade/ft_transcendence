import { forwardRef, Module } from '@nestjs/common';
import { ChatGateway } from './chat.geteway';
import { ChatroomController } from './chatroom.controller';
import { ChatroomService } from './chat.service';
import { repo, UserModule } from 'src/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from 'src/entity/user.entity';
import { GameModule } from 'src/game/game.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([User]),
    forwardRef(() => GameModule),
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.secret'),
        signOptions: {
          expiresIn: configService.get<string>('jwt.expiresIn'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [ChatGateway, ChatroomService, repo],
  exports: [ChatGateway, ChatroomService],
  controllers: [ChatroomController],
})
export class ChatModule {}
