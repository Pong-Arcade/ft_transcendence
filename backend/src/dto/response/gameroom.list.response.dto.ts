import { GameRoomListDto } from '../gameroom.list.dto';

/**
 * 현재 게임방 목록을 반환하는 응답 DTO입니다.
 * gameRooms: 게임방 리스트
 * isLast: 마지막 페이지인지 여부
 */
export class GameRoomListResponseDto {
  gameRooms: GameRoomListDto[];
}
