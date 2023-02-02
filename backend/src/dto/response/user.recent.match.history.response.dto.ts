import { MatchHistoryDto } from '../match.history.dto';
import { UserDto } from '../user.dto';

/**
 * 유저의 최근 전적 기록을 반환하는 dto입니다.
 * userInfo는 검색한 유저의 정보를 저장합니다.
 * matchHistories는 검색한 유저의 최근 전적 기록을 저장합니다.
 */
export class UserRecentMatchHistoryResponseDto {
  userInfo: UserDto; // 검색한 유저의 정보
  matchHistories: MatchHistoryDto[]; // 검색한 유저의 최근 전적 기록
}
