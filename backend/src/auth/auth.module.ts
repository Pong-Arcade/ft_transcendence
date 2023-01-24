import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { FtStrategy } from './42/ft.strategy';
import { SessionSerializer } from './session/session.serializer';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [PassportModule.register({ session: true })],
  controllers: [AuthController],
  providers: [FtStrategy, SessionSerializer],
})
export class AuthModule {}
