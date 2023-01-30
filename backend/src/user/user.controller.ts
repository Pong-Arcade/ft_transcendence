import {
  Controller,
  Get,
  HttpCode,
  Logger,
  Query,
  UseGuards,
} from '@nestjs/common';
import { SessionAuthGuard } from 'src/auth/session/session.guard';
import { User } from 'src/decorator/user.decorator';
import { UserDto } from 'src/dto/user.dto';

@Controller('/api/users')
export class UserController {
  private logger = new Logger(UserController.name);

  @Get('/online-users/')
  @UseGuards(SessionAuthGuard)
  @HttpCode(200)
  async getOnlineUsers(
    @User() user: UserDto,
    @Query('page') page: number,
    @Query('length') length: number,
  ) {
    this.logger.log(`Called ${this.getOnlineUsers.name}`);
    console.log(user);
  }
}
