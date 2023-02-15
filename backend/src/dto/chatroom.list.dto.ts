import { ApiProperty } from '@nestjs/swagger';
import { ChatRoomMode } from 'src/enum/chatroom.mode.enum';

/**
 * 채팅방 목록을 반환하는 dto입니다.
 */
export class ChatRoomListDto {
  @ApiProperty({
    description: '채팅방 ID',
    example: 1,
  })
  roomId: number;

  @ApiProperty({
    description: '채팅방 제목',
    example: '채팅방 제목입니다.',
  })
  title: string;

  @ApiProperty({
    description: '채팅방 모드 (비밀번호/초대전용/공개)',
    example: ChatRoomMode.PROTECTED,
    enum: ChatRoomMode,
  })
  mode: ChatRoomMode;

  @ApiProperty({
    description: '최대 유저 수',
    example: 10,
  })
  maxUserCount: number;

  @ApiProperty({
    description: '현재 유저 수',
    example: 5,
  })
  currentCount: number;
}
