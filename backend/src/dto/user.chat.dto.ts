import { UserChatMode } from 'src/enum/user.chat.mode.enum';
import { UserDto } from './user.dto';
import { ApiProperty } from '@nestjs/swagger';

/**
 * 채팅방에 참여한 유저의 정보를 반환하는 dto입니다.
 * @property mode 유저의 채팅 모드
 */
export class UserChatDto extends UserDto {
  @ApiProperty({
    description: '유저의 채팅 모드(방장/관리자/일반)',
    example: UserChatMode.NORMAL,
    enum: UserChatMode,
  })
  mode: UserChatMode;
}
