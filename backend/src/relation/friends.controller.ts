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
import { UserFriendListResponseDto } from '../dto/response/user.friend.list.response.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

const friendUsers: UserFriendListResponseDto = {
  friendUsers: [
    {
      userId: 1,
      nickname: 'youngpar',
      avatarUrl: 'qwe.jpeg',
      email: 'qwe@asd.com',
    },
    {
      userId: 2,
      nickname: 'youngpar2',
      avatarUrl: 'qwe2.jpeg',
      email: 'qwe2@asd.com',
    },
  ],
  isLast: true,
};

@ApiTags('Relation')
@Controller('api/friends')
export class FriendsController {
  private logger = new Logger(FriendsController.name);

  @ApiOperation({
    summary: '유저의 친구 목록',
    description: '해당 유저의 모든 친구정보를 불러옵니다.',
  })
  @Get()
  async getFriend(@User() user: UserDto) {
    this.logger.log(`Called ${this.getFriend.name}`);
    return friendUsers;
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
