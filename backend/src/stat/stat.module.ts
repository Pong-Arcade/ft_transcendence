import { Module } from '@nestjs/common';
import { StatController } from './stat.controller';

@Module({
  controllers: [StatController],
})
export class StatModule {}
