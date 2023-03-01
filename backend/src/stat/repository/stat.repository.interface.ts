import { GameStatDto } from 'src/dto/game.stat.dto';
import { MatchHistoryDto } from 'src/dto/match.history.dto';
import { MyMatchHistoryDto } from 'src/dto/my.match.history.dto';
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
  getRecentRecord(userId: number): Promise<MyMatchHistoryDto[]>;

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

  /**
   * 유저의 전적을 저장합니다.
   * @param matchHistory
   */
  createMatchHistory(matchHistory: MatchHistoryDto): Promise<void>;

  /**
   * 일반게임의 승자의 winCount를 올립니다.
   * @param userId
   */
  updateWinNormalStat(userId: number): Promise<void>;

  /**
   * 일반게임의 패자의 loseCount를 올립니다.
   * @param userId
   */
  updateLoseNormalStat(userId: number): Promise<void>;

  /**
   * 레더게임의 승자의 windCount를 올리고 ladder스코어를 반영합니다.
   * @param userId
   */
  updateWinLadderStat(userId: number, score: number): Promise<void>;

  /**
   * 레더게임의 패자의 loseCount를 올리고 ladder스코어를 반영합니다.
   * @param userId
   */
  updateLoseLadderStat(userId: number, score: number): Promise<void>;
}
