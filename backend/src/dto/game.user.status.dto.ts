import { GameRoomUserStatus } from 'src/enum/gameroom.user.status.enum';
import { UserDto } from './user.dto';

export class GameUserStatusDto extends UserDto {
  gameUserStatus: GameRoomUserStatus;
}
