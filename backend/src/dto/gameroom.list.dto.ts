import { GameRoomStatus } from 'src/enum/gameroom.status.enum';
import { UserDto } from './user.dto';

/**
 * 게임방 목록을 반환하는 dto입니다.
 */
export class GameRoomListDto {
  roomId: number; // 게임방 ID
  redUser: UserDto; // 빨간 팀 유저
  blueUser: UserDto; // 파란 팀 유저
  maxSpectatorCount: number; // 최대 관전자 수
  curSpectatorCount: number; // 현재 관전자 수
  roomStatus: GameRoomStatus; // 게임방 상태
}
