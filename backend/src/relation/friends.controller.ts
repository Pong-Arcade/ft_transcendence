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
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserFriendListResponseDto } from '../dto/response/user.friend.list.response.dto';
import { FriendsService } from './friends.service';

@ApiTags('Relation')
@Controller('api/friends')
export class FriendsController {
  private logger = new Logger(FriendsController.name);
  constructor(private readonly friendService: FriendsService) {}
  @ApiOperation({
    summary: '유저의 친구 목록',
    description: '해당 유저의 모든 친구정보를 불러옵니다.',
  })
  @ApiResponse({
    status: 200,
    description: '전체 친구 목록',
    type: UserFriendListResponseDto,
  })
  @Get()
  async getFriend(@User() user: UserDto) {
    this.logger.log(`Called ${this.getFriend.name}`);
    return await this.friendService.getFriends(user);
  }

  @Patch(':user_id')
  @HttpCode(201)
  @ApiOperation({
    summary: '친구 추가',
    description: '유저를 친구 추가합니다.',
  })
  @ApiResponse({
    status: 400,
    description: '잘못된 요청입니다',
  })
  @ApiResponse({
    status: 404,
    description: '존재하지 않는 유저입니다',
  })
  @ApiResponse({
    status: 409,
    description: '이미 추가된 유저입니다',
  })
  async addFriend(@User() user: UserDto, @Param('user_id') userId: number) {
    this.logger.log(`Called ${this.addFriend.name}`);
    this.friendService.addFriend({ user: user.userId, target: userId });
  }

  @Delete(':user_id')
  @HttpCode(204)
  @ApiOperation({
    summary: '친구 삭제',
    description: '유저의 친구를 삭제합니다.',
  })
  @ApiResponse({
    status: 400,
    description: '잘못된 요청입니다',
  })
  @ApiResponse({
    status: 404,
    description: '존재하지 않는 유저입니다',
  })
  async delFriend(@User() user: UserDto, @Param('user_id') userId: number) {
    this.logger.log(`Called ${this.delFriend.name}`);
    this.friendService.delFriend({ user: user.userId, target: userId });
  }

  @ApiOperation({ summary: '친추테스트' })
  @Get('test')
  async testFriend() {
    this.logger.log(`Friends Test Start`);
    //  given
    const testUser: UserDto = {
      userId: 1,
      nickname: 'youngpar',
    };
    this.logger.debug(`When ${this.addFriend.name}(${testUser}, 2, 4)`);
    await this.addFriend(testUser, 2);
    await this.addFriend(testUser, 4);
    //  when : 1번 유저의 친구 목록에 2번, 4번 유저 추가
    const relation: UserFriendListResponseDto =
      await this.friendService.getFriends(testUser);
    //  then : 1번 유저(testUser)의 친구목록 얻어옴
    this.logger.debug(`Then ${this.getFriend.name} =>`, relation);
    this.logger.log(`Friends Test End`);
    return relation;
  }
}
