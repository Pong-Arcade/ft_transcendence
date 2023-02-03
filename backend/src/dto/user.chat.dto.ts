import { UserChatMode } from 'src/enum/user.chat.mode.enum';
import { UserDto } from './user.dto';

/**
 * 채팅방에 참여한 유저의 정보를 반환하는 dto입니다.
 * @property mode 유저의 채팅 모드
 */
export class UserChatDto extends UserDto {
  mode: UserChatMode;
}
