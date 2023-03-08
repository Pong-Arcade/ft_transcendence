import { Module, forwardRef } from '@nestjs/common';
import { GameGateway } from './game.gateway';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { GameRoomController } from './gameroom.controller';
import { GameRoomService } from './gameroom.service';
import { UserModule } from 'src/user/user.module';
import { ChatModule } from 'src/chat/chat.module';
import { StatModule } from 'src/stat/stat.module';
import { StatusModule } from 'src/status/status.module';

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
    UserModule,
    forwardRef(() => ChatModule),
    StatModule,
    forwardRef(() => StatusModule),
  ],
  providers: [GameGateway, GameRoomService],
  exports: [GameGateway, GameRoomService],
  controllers: [GameRoomController],
})
export class GameModule {}
