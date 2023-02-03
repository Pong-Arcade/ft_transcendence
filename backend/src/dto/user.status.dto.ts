import { UserStatus } from 'src/enum/user.status.enum';
import { UserDto } from './user.dto';

/**
 * 상태를 포함한 유저의 정보를 반환하는 dto입니다.
 */
export class UserStatusDto extends UserDto {
  status: UserStatus; // 유저의 상태
}
