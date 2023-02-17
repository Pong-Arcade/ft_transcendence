import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, MaxLength } from 'class-validator';
import { ChatRoomMode } from 'src/enum/chatroom.mode.enum';

/**
 * 채팅방 정보 변경 요청 dto입니다.
 * mode는 채팅방의 모드를 변경합니다.
 * title은 채팅방의 제목을 변경합니다.
 * password는 채팅방의 비밀번호를 변경합니다.
 * 최대 인원수는 변경할 수 없습니다.
 */
export class ChangeChatroomInfoRequestDto {
  @ApiProperty({
    description: '채팅방 모드 (비밀번호/초대전용/공개)',
    example: ChatRoomMode.PROTECTED,
    enum: ChatRoomMode,
  })
  @IsEnum(ChatRoomMode)
  mode: ChatRoomMode;

  @ApiProperty({
    description: '채팅방 제목',
    example: '채팅방 제목입니다.',
  })
  @IsString()
  @MaxLength(32)
  title: string;

  @ApiProperty({
    description: '채팅방 비밀번호(optional)',
    example: '1234',
    required: false,
  })
  @IsString()
  @MaxLength(32)
  password?: string;
}
