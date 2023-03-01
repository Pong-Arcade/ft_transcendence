import { GameStatDto } from 'src/dto/game.stat.dto';
import { MatchHistoryDto } from 'src/dto/match.history.dto';
import { RankDto } from 'src/dto/rank.dto';
import { RankingFilter } from 'src/enum/ranking.filter.enum';
import { SortDirection } from 'src/enum/sort.direction.enum';

export interface IStatRepository {
  /**
   * 전체 유저의 랭킹을 가져옵니다.
   */
  getRanking(filter: RankingFilter, order: SortDirection): Promise<RankDto[]>;

  /**
   * 유저의 최근 전적을 가져옵니다.
   * @param userId
   */
  getRecentRecord(userId: number): Promise<MatchHistoryDto[]>;

  /**
   * 유저의 래더 게임 전적을 가져옵니다.
   * @param userId
   */
  getUserLadderStat(userId: number): Promise<GameStatDto>;

  /**
   * 유저의 일반 게임 전적을 가져옵니다.
   * @param userId
   */
  getUserNormalStat(userId: number): Promise<GameStatDto>;
}
