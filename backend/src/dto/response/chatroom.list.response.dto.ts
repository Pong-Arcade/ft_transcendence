import { ChatRoomListDto } from '../chatroom.list.dto';

/**
 * 현재 채팅방 목록을 반환하는 응답 DTO입니다.
 * chatRooms: 채팅방 리스트
 * isLast: 마지막 페이지인지 여부
 */
export class ChatRoomListResponseDto {
  chatRooms: ChatRoomListDto[]; // 채팅방 리스트
  isLast: boolean; // 마지막 페이지인지 여부
}
