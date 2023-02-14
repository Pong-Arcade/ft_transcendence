import { MatchHistoryDto } from 'src/dto/match.history.dto';
import { RankDto } from 'src/dto/rank.dto';
import { RankingFilter } from 'src/enum/ranking.filter.enum';

export interface IStatRepository {
  /**
   * 전체 유저의 랭킹을 가져옵니다.
   */
  getRanking(filter: RankingFilter, order: string): Promise<RankDto[]>;

  /**
   * 유저의 최근 전적을 가져옵니다.
   * @param userId
   */
  getRecentRecord(userId: number): Promise<MatchHistoryDto[]>;
}
