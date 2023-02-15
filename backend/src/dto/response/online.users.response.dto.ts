import { UserDto } from '../user.dto';

/**
 * 현재 온라인인 유저들의 정보를 담는 DTO
 */
export class OnlineUsersResponseDto {
  onlineUsers: UserDto[]; // 현재 온라인인 유저들의 정보
}
