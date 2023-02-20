import { Module, forwardRef } from '@nestjs/common';
import { GameGateway } from './game.gateway';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthModule } from 'src/auth/auth.module';
import { GameRoomController } from './gameroom.controller';
import { GameRoomService } from './gameroom.service';
import { UserModule } from 'src/user/user.module';

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
    AuthModule,
    forwardRef(() => UserModule),
  ],
  providers: [GameGateway, GameRoomService],
  exports: [GameGateway],
  controllers: [GameRoomController],
})
export class GameModule {}
