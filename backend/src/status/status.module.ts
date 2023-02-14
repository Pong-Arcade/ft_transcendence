import { Module } from '@nestjs/common';
import { User } from './status.entity';
export let users = new Map<number, User>();
@Module({})
export class StatusModule {}
