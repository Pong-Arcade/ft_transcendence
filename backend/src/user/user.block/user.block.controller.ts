import {
  Controller,
  Get,
  Post,
  Delete,
  Query,
  HttpCode,
  Logger,
  Param,
  UseGuards,
} from '@nestjs/common';
import { SessionAuthGuard } from 'src/auth/session/session.guard';
import { User } from 'src/decorator/user.decorator';
import { UserDto } from 'src/dto/user.dto';

@Controller('api/users/block')
export class UserBlockController {
	private logger = new Logger(UserBlockController.name);

	@Get()
	@UseGuards(SessionAuthGuard)
	@HttpCode(200)
	async getAllBlock(
		@User() user: UserDto,
		@Query('page') page: number,
		@Query('length') length: number,
	) {
		this.logger.log(`Called ${this.getAllBlock.name}`);
		console.log(user);
	}

	@Post()
	@UseGuards(SessionAuthGuard)
	@HttpCode(201)
	async addBlock(
		@User() user: UserDto,
		@Param('user-id') userId: number,
	) {
		this.logger.log(`Called ${this.addBlock.name}`);
		console.log(user);
	}

	@Delete()
	@UseGuards(SessionAuthGuard)
	@HttpCode(204)
	async delBlock(
		@User() user: UserDto,
		@Param('user-id') userId: number,
	) {
		this.logger.log(`Called ${this.delBlock.name}`);
		console.log(user);
	}
}

