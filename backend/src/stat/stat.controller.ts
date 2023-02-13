import { Controller, Get, Logger, Param } from '@nestjs/common';
import { UserRecentMatchHistoryResponseDto } from '../dto/response/user.recent.match.history.response.dto';
import { MatchResult } from '../enum/match.result.enum';
import { MatchType } from '../enum/match.type.enum';
import { RankListResponseDto } from '../dto/response/rank.list.response.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from '../decorator/user.decorator';
import { UserDto } from '../dto/user.dto';

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
  rankList: [
    {
      ranking: 1,
      userInfo: {
        userId: 1,
        nickname: 'sichoi',
        avatarUrl: 'https://example.com',
      },
      ladderScore: 1200,
      winCount: 10,
      loseCount: 0,
      winRate: 100,
    },
    {
      ranking: 2,
      userInfo: {
        userId: 2,
        nickname: 'youngpar',
        avatarUrl: 'https://example.com',
      },
      ladderScore: 1000,
      winCount: 9,
      loseCount: 1,
      winRate: 90,
    },
  ],
  isLast: false,
};

@ApiTags('Stat')
@Controller('api/stat')
export class StatController {
  private logger = new Logger(StatController.name);

  @ApiOperation({
    summary: '랭킹',
    description: '전체 유저의 랭킹을 조회합니다.',
  })
  @Get('ranking')
  async getRanking(@User() user: UserDto) {
    this.logger.log(`Called ${this.getRanking.name}`);
    return rankRet;
  }

  @ApiOperation({
    summary: '최근 전적',
    description: '특정 유저의 최근 전적 조회',
  })
  @Get('recent-records/:user_id')
  async getGameRecord(@Param('user_id') userId: number) {
    this.logger.log(`Called ${this.getGameRecord.name}`);
    return gameRet;
  }
}
