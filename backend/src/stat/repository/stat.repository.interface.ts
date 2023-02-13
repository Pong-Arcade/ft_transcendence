import { MatchHistoryDto } from 'src/dto/match.history.dto';

export interface IStatRepository {
  /**
   * 유저의 최근 전적을 가져옵니다.
   * @param userId
   */
  getRecentRecord(userId: number): Promise<MatchHistoryDto[]>;
}
