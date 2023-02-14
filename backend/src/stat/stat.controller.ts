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
  matchHistories: [],
};
const formatDate = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');
  const second = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
};

for (let i = 0; i < 11; ++i) {
  gameRet.matchHistories.push({
    matchId: i,
    matchResult: i % 2 == 0 ? MatchResult.WIN : MatchResult.LOSE,
    opponent: {
      userId: 2,
      nickname: 'youngpar',
      avatarUrl: 'https://example.com',
    },
    myScore: 11,
    opponentScore: 8,
    beginDate: formatDate(),
    matchTime: 612,
    matchType: i % 2 == 0 ? MatchType.LADDER : MatchType.NORMAL,
  });
}

const rankRet: RankListResponseDto = {
  rankList: [],
  isLast: false,
};
for (let i = 0; i < 38; ++i) {
  rankRet.rankList.push({
    ranking: i + 1,
    userInfo: {
      userId: i,
      nickname: `sichoi${i}`,
      avatarUrl: 'https://example.com',
    },
    ladderScore: 1200 - i * 10,
    winCount: 50 - i,
    loseCount: i,
    winRate: Math.round(((50 - i) / 50) * 100),
  });
}

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
