import { Module } from '@nestjs/common';
import { StatusService } from './status.service';
import { User } from './status.entity';
export const users = new Map<number, User>();
@Module({
  imports: [],
  providers: [StatusService],
  exports: [StatusService],
})
export class StatusModule {}
