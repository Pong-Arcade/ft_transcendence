import {
  Controller,
  Delete,
  Get,
  HttpCode,
  Logger,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from 'src/decorator/user.decorator';
import { UserDto } from 'src/dto/user.dto';
import { UserFriendListResponseDto } from '../dto/response/user.friend.list.response.dto';
import { OnlineUsersResponseDto } from '../dto/response/online.users.response.dto';
import { UserBlockListResponseDto } from '../dto/response/user.block.list.response.dto';
import { ChatGateway } from '../chat/chat.geteway';
import { GameGateway } from '../game/game.gateway';
import { UserRecentMatchHistoryResponseDto } from '../dto/response/user.recent.match.history.response.dto';
import { MatchResult } from '../enum/match.result.enum';
import { RankListResponseDto } from '../dto/response/rank.list.response.dto';
import { MatchType } from '../enum/match.type.enum';

const onlineUsers: OnlineUsersResponseDto = {
  onlineUsers: [
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
const blockUsers: UserBlockListResponseDto = {
  blockUsers: [
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

const gameRet: UserRecentMatchHistoryResponseDto = {
  userInfo: {
    userId: 1,
    nickname: 'sichoi',
    avatarUrl: 'https://example.com',
  },
  matchHistories: [
    {
      matchId: 1,
      matchResult: MatchResult.WIN,
      opponent: {
        userId: 2,
        nickname: 'youngpar',
        avatarUrl: 'https://example.com',
      },
      myScore: 11,
      opponentScore: 8,
      beginDate: new Date('2023-02-03T11:47:41.000Z'),
      matchTime: 282000,
      matchType: MatchType.LADDER,
    },
    {
      matchId: 2,
      matchResult: MatchResult.LOSE,
      opponent: {
        userId: 3,
        nickname: 'kangkim',
        avatarUrl: 'https://example.com',
      },
      myScore: 9,
      opponentScore: 11,
      beginDate: new Date('2023-02-01T11:47'),
      matchTime: 272000,
      matchType: MatchType.NORMAL,
    },
  ],
};
const rankRet: RankListResponseDto = {
  rankList: [],
  isLast: false,
};
for (let i = 0; i < 38; ++i) {
  rankRet.rankList.push({
    ranking: i + 1,
    userInfo: {
      userId: i,
      nickname: 'sichoi',
      avatarUrl: 'https://example.com',
    },
    ladderScore: 1200,
    winCount: 10,
    loseCount: 0,
    winRate: 100,
  });
}

@ApiTags('Users')
@Controller('/api/users')
export class UserController {
  private logger = new Logger(UserController.name);

  constructor(
    private chatGateway: ChatGateway,
    private gameGateway: GameGateway,
  ) {}

  @ApiOperation({
    summary: '모든 온라인 유저 배열 반환',
    description: 'Pagenation으로 가져올 데이터의 수 지정',
  })
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
  @Delete('friend/:user_id')
  @HttpCode(204)
  async delFriendUsers(
    @User() user: UserDto,
    @Param('user_id') userId: number,
  ) {
    this.logger.log(`Called ${this.delFriendUsers.name}`);
    //  TODO: Business Logic!
  }

  @ApiOperation({
    summary: '차단 해제',
    description: '차단된 유저를 해제합니다.',
  })
  @Delete('block/:user_id')
  @HttpCode(204)
  async delBlockUsers(@User() user: UserDto, @Param('user_id') userId: number) {
    this.logger.log(`Called ${this.delBlockUsers.name}`);
    //  TODO: Business Logic!
  }

  @ApiOperation({
    summary: '최근 전적',
    description: '특정 유저의 최근 전적 조회',
  })
  @Get(':user_id/records')
  async getGameRecord(@Param('user_id') userId: number) {
    this.logger.log(`Called ${this.getGameRecord.name}`);
    return gameRet;
  }

  @ApiOperation({
    summary: '랭킹',
    description: '전체 유저의 랭킹을 조회합니다.',
  })
  @Get('rank')
  async getRank(@User() user: UserDto) {
    this.logger.log(`Called ${this.getRank.name}`);
    return rankRet;
  }
}
