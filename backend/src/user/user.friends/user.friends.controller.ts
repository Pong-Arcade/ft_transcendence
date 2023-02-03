import {
  Controller,
  Get,
  Post,
  Delete,
  HttpCode,
  Logger,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { SessionAuthGuard } from 'src/auth/session/session.guard';
import { User } from 'src/decorator/user.decorator';
import { UserDto } from 'src/dto/user.dto';

@Controller('api/users/friends')
export class UserFriendsController {
	private logger = new Logger(UserFriendsController.name);

	@Get()
	@UseGuards(SessionAuthGuard)
	@HttpCode(200)
	async getAllFriends(
		@User() user: UserDto,
		@Query('page') page: number,
		@Query('length') length: number,
	) {
		this.logger.log(`Called ${this.getAllFriends.name}`);
		console.log(user);
	}


	@Post()
	@UseGuards(SessionAuthGuard)
	@HttpCode(201)
	async addFriends(
		@User() user: UserDto,
		@Param('user-id') userId: number,
	) {
		this.logger.log(`Called ${this.addFriends.name}`);
		console.log(user);
	}

	@Delete()
	@UseGuards(SessionAuthGuard)
	@HttpCode(204)
	async delFriends(
		@User() user: UserDto,
		@Param('user-id') userId: number,
	) {
		this.logger.log(`Called ${this.delFriends.name}`);
		console.log(user);
	}
}
