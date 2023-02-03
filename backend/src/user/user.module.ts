import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { UserFriendsController } from './user.friends/user.friends.controller';
import { UserBlockController } from './user.block/user.block.controller';

@Module({
  imports: [
	TypeOrmModule.forFeature([
		UserRepository,
	]),
  ],
  controllers: [UserController, UserFriendsController, UserBlockController],
  providers: [
	  UserService,
	  UserRepository,
  ],
})
export class UserModule {}
