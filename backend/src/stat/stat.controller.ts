import { Controller, Get, Logger, Param, ParseIntPipe } from '@nestjs/common';
import { UserRecentMatchHistoryResponseDto } from '../dto/response/user.recent.match.history.response.dto';
import { MatchResult } from '../enum/match.result.enum';
import { MatchType } from '../enum/match.type.enum';
import { RankListResponseDto } from '../dto/response/rank.list.response.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from '../decorator/user.decorator';
import { UserDto } from '../dto/user.dto';
import { StatService } from './stat.service';

@ApiTags('Stat')
@Controller('api/stat')
export class StatController {
  private logger = new Logger(StatController.name);

  constructor(private readonly statService: StatService) {}

  @ApiOperation({
    summary: '랭킹',
    description: '전체 유저의 랭킹을 조회합니다.',
  })
  @Get('ranking')
  async getRanking(@User() user: UserDto) {
    this.logger.log(`Called ${this.getRanking.name}`);
    return;
  }

  @ApiOperation({
    summary: '최근 전적',
    description: '특정 유저의 최근 전적을 조회합니다.',
  })
  @Get('recent-records/:user_id')
  async getRecentRecord(
    @Param('user_id', ParseIntPipe) userId: number,
  ): Promise<UserRecentMatchHistoryResponseDto> {
    this.logger.log(`Called ${this.getRecentRecord.name}`);
    return await this.statService.getRecentRecord(userId);
  }
}
