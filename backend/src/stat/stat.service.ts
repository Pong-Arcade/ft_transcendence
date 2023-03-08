import {
  forwardRef,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { IStatRepository } from './repository/stat.repository.interface';
import { UserRecentMatchHistoryResponseDto } from 'src/dto/response/user.recent.match.history.response.dto';
import { UserService } from 'src/user/user.service';
import { RankListResponseDto } from 'src/dto/response/rank.list.response.dto';
import { RankingFilter } from 'src/enum/ranking.filter.enum';
import { SortDirection } from 'src/enum/sort.direction.enum';
import { GameStatDto } from 'src/dto/game.stat.dto';
import { MatchHistoryDto } from 'src/dto/match.history.dto';
import { MatchType } from 'src/enum/match.type.enum';

@Injectable()
export class StatService {
  private logger = new Logger(StatService.name);

  constructor(
    @Inject('IStatRepository')
    private readonly statRepository: IStatRepository,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}

  async getRanking(
    filter: RankingFilter,
    order: SortDirection,
  ): Promise<RankListResponseDto> {
    this.logger.debug(`Called ${this.getRanking.name}`);
    const rankList = await this.statRepository.getRanking(filter, order);
    return {
      rankList: rankList,
    } as RankListResponseDto;
  }

  async getRecentRecord(
    userId: number,
  ): Promise<UserRecentMatchHistoryResponseDto> {
    this.logger.debug(`Called ${this.getRecentRecord.name}`);
    const userInfo = await this.userService.getUserInfo(userId);
    if (!userInfo) {
      throw new NotFoundException('존재하지 않는 유저입니다.');
    }
    const matchHistories = await this.statRepository.getRecentRecord(userId);
    return {
      userInfo,
      matchHistories,
    } as UserRecentMatchHistoryResponseDto;
  }

  async getUserGameStat(userId: number): Promise<[GameStatDto, GameStatDto]> {
    this.logger.debug(`Called ${this.getUserGameStat.name}`);
    return [
      await this.statRepository.getUserLadderStat(userId),
      await this.statRepository.getUserNormalStat(userId),
    ];
  }

  async createMatchHistory(matchHistory: MatchHistoryDto): Promise<void> {
    this.logger.debug(`Called ${this.createMatchHistory.name}`);
    await this.statRepository.createMatchHistory(matchHistory);
    // FIXME: ladder, normal 테이블 업데이트
    const winner =
      matchHistory.redScore > matchHistory.blueScore
        ? matchHistory.redUserId
        : matchHistory.blueUserId;
    let delta =
      winner === matchHistory.redUserId
        ? matchHistory.redScore - matchHistory.blueScore
        : matchHistory.blueScore - matchHistory.redScore;

    delta = delta > 5 ? 5 : delta;
    delta *= 10;

    const loser =
      winner !== matchHistory.redUserId
        ? matchHistory.redUserId
        : matchHistory.blueUserId;
    if (matchHistory.matchType === MatchType.NORMAL) {
      await this.statRepository.updateWinNormalStat(winner);
      await this.statRepository.updateLoseNormalStat(loser);
    } else {
      await this.statRepository.updateWinLadderStat(winner, delta);
      await this.statRepository.updateLoseLadderStat(loser, delta);
    }
  }
}
