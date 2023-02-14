import {
  Controller,
  Get,
  Logger,
  Param,
  ParseEnumPipe,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { UserRecentMatchHistoryResponseDto } from '../dto/response/user.recent.match.history.response.dto';
import { RankListResponseDto } from '../dto/response/rank.list.response.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { StatService } from './stat.service';
import { RankingFilter } from 'src/enum/ranking.filter.enum';

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
  async getRanking(
    @Query('filter', new ParseEnumPipe(RankingFilter)) filter: RankingFilter,
    @Query('order') order: string,
  ): Promise<RankListResponseDto> {
    this.logger.log(`Called ${this.getRanking.name}`);
    return await this.statService.getRanking(filter, order);
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
