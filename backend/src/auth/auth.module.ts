import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { FtStrategy } from './42/ft.strategy';
import { SessionSerializer } from './session/session.serializer';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthRepository } from './repository/auth.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from 'src/entity/user.entity';

const repo = {
  provide: 'IAuthRepository',
  useClass: AuthRepository,
};

@Module({
  imports: [
    PassportModule.register({ session: true }),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [AuthController],
  providers: [FtStrategy, SessionSerializer, AuthService, repo],
})
export class AuthModule {}
