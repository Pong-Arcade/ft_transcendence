import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { FtStrategy } from './42/ft.strategy';
import { AuthService } from './auth.service';
import { AuthRepository } from './repository/auth.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from 'src/entity/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt/jwt.strategy';
import NormalStat from 'src/entity/normal.stat.entity';
import LadderStat from 'src/entity/ladder.stat.entity';
import { TwoFactorAuth } from 'src/entity/two.factor.auth.entity';
import { UtilsModule } from 'src/utils/utils.module';

const repo = {
  provide: 'IAuthRepository',
  useClass: AuthRepository,
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
    TypeOrmModule.forFeature([User, TwoFactorAuth, NormalStat, LadderStat]),
    UtilsModule,
  ],
  providers: [FtStrategy, JwtStrategy, AuthService, repo],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
