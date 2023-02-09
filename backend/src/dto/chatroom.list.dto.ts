import { ChatRoomMode } from 'src/enum/chatroom.mode.enum';

/**
 * 채팅방 목록을 반환하는 dto입니다.
 */
export class ChatRoomListDto {
  roomId: number; // 채팅방 ID
  title: string; // 채팅방 제목
  mode: ChatRoomMode; // 채팅방 모드
  maxUserCount: number; // 최대 유저 수
  currentCount: number; // 현재 유저 수
}
