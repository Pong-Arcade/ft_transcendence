import {
  Controller,
  Get,
  HttpCode,
  Logger,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiFoundResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { User } from 'src/decorator/user.decorator';
import { UserDto } from 'src/dto/user.dto';
import { UserFriendListResponseDto } from '../dto/response/user.friend.list.response.dto';
import { UserStatusDto } from '../dto/user.status.dto';
import { OnlineUsersResponseDto } from '../dto/response/online.users.response.dto';
import { UserBlockListResponseDto } from '../dto/response/user.block.list.response.dto';

const ONLINE_USER_NUM = 47;
const FRIEND_USER_NUM = 14;
const BLOCK_USER_NUM = 8;

const onlineUsers: OnlineUsersResponseDto = {
  onlineUsers: [],
  isLast: true,
};
const friendUsers: UserFriendListResponseDto = {
  friendUsers: [],
  isLast: true,
};
const blockUsers: UserBlockListResponseDto = {
  blockUsers: [],
  isLast: true,
};

for (let i = 0; i < ONLINE_USER_NUM; ++i) {
  onlineUsers.onlineUsers.push({
    userId: i,
    nickname: `onlineUser${i}`,
    avatarUrl: `onlineUser${i}.jpeg`,
    email: `onlineUser${i}@asd.com`,
  });
}
for (let i = 0; i < FRIEND_USER_NUM; ++i) {
  friendUsers.friendUsers.push({
    userId: i,
    nickname: `friendUser${i}`,
    avatarUrl: `friendUser${i}.jpeg`,
    email: `friendUser${i}@asd.com`,
  });
}
for (let i = 0; i < BLOCK_USER_NUM; ++i) {
  blockUsers.blockUsers.push({
    userId: i,
    nickname: `blockUsers${i}`,
    avatarUrl: `blockUsers${i}.jpeg`,
    email: `blockUsers${i}@asd.com`,
  });
}

@ApiTags('Users')
@Controller('/api/users')
export class UserController {
  private logger = new Logger(UserController.name);

  @ApiOperation({
    summary: '모든 온라인 유저 배열 반환',
    description: 'Pagenation으로 가져올 데이터의 수 지정',
  })
  //@ApiOkResponse({type: UserDto, isArray: true})
  @Get()
  @HttpCode(200)
  async getOnlineUsers(
    @User() user: UserDto,
    @Query('page') page: number,
    @Query('length') length: number,
  ) {
    this.logger.log(`Called ${this.getOnlineUsers.name}`);
    return onlineUsers;
  }

  @ApiOperation({
    summary: '유저의 친구 목록',
    description: '해당 유저의 모든 친구정보를 불러옵니다.',
  })
  @Get('friend')
  @HttpCode(200)
  async getFriendUsers(
    @User() user: UserDto,
    @Query('page') page: number,
    @Query('length') length: number,
  ) {
    this.logger.log(`Called ${this.getFriendUsers.name}`);
    return friendUsers;
  }

  @ApiOperation({
    summary: '유저의 차단 목록',
    description: '해당 유저가 차단한 유저들의 목록을 제공합니다.',
  })
  @Get('block')
  @HttpCode(200)
  async getBlockUsers(
    @User() user: UserDto,
    @Query('page') page: number,
    @Query('length') length: number,
  ) {
    this.logger.log(`Called ${this.getBlockUsers.name}`);
    return blockUsers;
  }

  @ApiOperation({
    summary: '친구 추가',
    description: '유저를 친구 추가합니다.',
  })
  @Post('friend/:user_id')
  @HttpCode(201)
  async addFriendUsers(
    @User() user: UserDto,
    @Param('user_id') userId: number,
  ) {
    this.logger.log(`Called ${this.addFriendUsers.name}`);
    //  TODO: Business Logic!
  }

  @ApiOperation({
    summary: '차단 등록',
    description: '유저를 차단합니다.',
  })
  @Post('block/:user_id')
  @HttpCode(201)
  async addBlockUsers(@User() user: UserDto, @Param('user_id') userId: number) {
    this.logger.log(`Called ${this.addBlockUsers.name}`);
    //  TODO: Business Logic!
  }

  @ApiOperation({
    summary: '친구 추가',
    description: '유저를 친구 추가합니다.',
  })
  @Post('friend/:user_id')
  @HttpCode(201)
  async delFriendUsers(
    @User() user: UserDto,
    @Param('user_id') userId: number,
  ) {
    this.logger.log(`Called ${this.delFriendUsers.name}`);
    //  TODO: Business Logic!
  }

  @ApiOperation({
    summary: '차단 등록',
    description: '유저를 차단합니다.',
  })
  @Post('block/:user_id')
  @HttpCode(201)
  async delBlockUsers(@User() user: UserDto, @Param('user_id') userId: number) {
    this.logger.log(`Called ${this.delBlockUsers.name}`);
    //  TODO: Business Logic!
  }
}
