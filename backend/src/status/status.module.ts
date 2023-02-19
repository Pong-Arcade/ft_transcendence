import { Module } from '@nestjs/common';
import { User } from './status.entity';
export const users = new Map<number, User>();
@Module({})
export class StatusModule {}
