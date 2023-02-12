import { UserDto } from './user.dto';

/**
 * 순위 정보를 저장하는 dto입니다.
 */
export class RankDto {
  ranking: number; // 순위
  userInfo: UserDto; // 유저 정보
  ladderScore: number; // 점수
  winCount: number; // 승리 횟수
  loseCount: number; // 패배 횟수
  winRate: number; // 승률
}
