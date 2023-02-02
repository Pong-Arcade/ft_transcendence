import { UserDto } from '../user.dto';

/**
 * 게임방에 참여한 유저들의 정보를 반환하는 dto입니다.
 * @property mastUserId 방장의 유저 id
 * @property users 게임방에 참여한 유저들의 정보
 */
export class ChatroomUsersInfoResponseDto {
  roomId: number; // 게임방 ID
  redUser: UserDto; // 빨간 팀 유저
  blueUser: UserDto; // 파란 팀 유저
  maxSpectatorCount: number; // 최대 관전자 수
  curSpectatorCount: number; // 현재 관전자 수
}
