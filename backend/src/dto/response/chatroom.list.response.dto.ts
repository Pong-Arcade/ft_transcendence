import { ApiProperty } from '@nestjs/swagger';
import { ChatRoomListDto } from '../chatroom.list.dto';
import { ChatRoomMode } from 'src/enum/chatroom.mode.enum';

/**
 * 현재 채팅방 목록을 반환하는 응답 DTO입니다.
 * chatRooms: 채팅방 리스트
 */
export class ChatRoomListResponseDto {
  @ApiProperty({
    description: '현재 채팅방 목록, 로비에서 확인하는 목록입니다.',
    example: [
      {
        roomId: 1,
        title: '채팅방1',
        mode: ChatRoomMode.PUBLIC,
        maxUserCount: 10,
        currentCount: 5,
      },
      {
        roomId: 2,
        title: '채팅방2',
        mode: ChatRoomMode.PROTECTED,
        maxUserCount: 10,
        currentCount: 7,
      },
      {
        roomId: 3,
        title: '채팅방3',
        mode: ChatRoomMode.PRIVATE,
        maxUserCount: 10,
        currentCount: 10,
      },
    ] as ChatRoomListDto[],
    type: ChatRoomListDto,
    isArray: true,
  })
  chatRooms: ChatRoomListDto[]; // 채팅방 리스트
}
