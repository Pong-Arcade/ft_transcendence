import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [PassportModule.register({ session: true })],
  controllers: [AuthController],
})
export class AuthModule {}
