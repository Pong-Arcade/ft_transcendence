import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { SessionSerializer } from './session/session.serializer';
import { PassportModule } from '@nestjs/passport';
import { FtMockStrategy } from './42/ft.mock.strategy';

@Module({
  imports: [PassportModule.register({ session: true })],
  controllers: [AuthController],
  providers: [FtMockStrategy, SessionSerializer],
})
export class AuthModule {}
