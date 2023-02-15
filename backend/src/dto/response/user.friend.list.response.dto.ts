import { UserDto } from '../user.dto';

/**
 * 유저의 친구 목록을 반환하는 dto입니다.
 * friendList는 친구의 유저정보 리스트를 저장합니다.
 */
export class UserFriendListResponseDto {
  friendUsers: UserDto[]; // 친구의 유저정보 리스트
}
