import { MatchResult } from 'src/enum/match.result.enum';
import { UserDto } from './user.dto';

/**
 * 대전 기록을 저장하는 dto입니다.
 */
export class MatchHistoryDto {
  matchId: number; // 대전의 고유 아이디
  matchResult: MatchResult; // 대전의 결과
  opponent: UserDto; // 대전 상대 유저 정보
  myScore: number; // 내 점수
  opponentScore: number; // 상대 점수
  beginDate: Date; // 대전 시작 시간
  matchTime: number; // 대전 시간(ms)
}
