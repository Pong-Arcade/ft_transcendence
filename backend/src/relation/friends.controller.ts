import {
  Controller,
  Delete,
  Get,
  HttpCode,
  Logger,
  Param,
  Patch,
} from '@nestjs/common';
import { User } from '../decorator/user.decorator';
import { UserDto } from '../dto/user.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { MockRepository } from '../mock/mock.repository';

@ApiTags('Relation')
@Controller('api/friends')
export class FriendsController {
  private logger = new Logger(FriendsController.name);
  private mock = new MockRepository();

  @ApiOperation({
    summary: '유저의 친구 목록',
    description: '해당 유저의 모든 친구정보를 불러옵니다.',
  })
  @Get()
  async getFriend(@User() user: UserDto) {
    this.logger.log(`Called ${this.getFriend.name}`);
    return this.mock.getFriendUser(41);
  }

  @ApiOperation({
    summary: '친구 추가',
    description: '유저를 친구 추가합니다.',
  })
  @Patch(':user_id')
  @HttpCode(201)
  async addFriend(@User() user: UserDto, @Param('user_id') userId: number) {
    this.logger.log(`Called ${this.addFriend.name}`);
    //  TODO: Business Logic!
  }

  @ApiOperation({
    summary: '친구 삭제',
    description: '유저의 친구를 삭제합니다.',
  })
  @Delete(':user_id')
  @HttpCode(204)
  async delFriend(@User() user: UserDto, @Param('user_id') userId: number) {
    this.logger.log(`Called ${this.delFriend.name}`);
    //  TODO: Business Logic!
  }
}
