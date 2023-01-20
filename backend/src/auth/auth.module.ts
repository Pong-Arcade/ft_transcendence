import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { FtStrategy } from './42/ft.strategy';

@Module({
  controllers: [AuthController],
  providers: [FtStrategy],
})
export class AuthModule {}
