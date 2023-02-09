import { UserStatusDto } from '../user.status.dto';

/**
 * 유저가 차단한 유저 목록을 반환하는 dto입니다.
 * blockList 차단한 유저정보 리스트를 저장합니다.
 * isLast는 마지막 페이지인지 여부를 저장합니다.
 */
export class UserBlockListResponseDto {
  blockUsers: UserStatusDto[]; // 차단 유저정보 리스트
  isLast: boolean; // 마지막 페이지인지 여부
}
