import { ChatRoomMode } from 'src/enum/chatroom.mode.enum';

/**
 * 채팅방 생성 요청 dto입니다.
 * mode는 채팅방의 모드를 저장합니다.
 * title은 채팅방의 제목을 저장합니다.
 * password는 채팅방의 비밀번호를 저장합니다.
 * maxUserCount는 채팅방의 최대 인원 수를 저장합니다.
 */
export class ChatroomCreateRequestDto {
  mode: ChatRoomMode;
  title: string;
  password?: string;
  maxUserCount: number;
}
