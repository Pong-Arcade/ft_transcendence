import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from '../user.dto';

/**
 * 현재 온라인인 유저들의 정보를 담는 DTO
 */
export class OnlineUsersResponseDto {
  @ApiProperty({
    description: '현재 온라인인 유저들의 정보',
    example: [
      {
        userId: 1,
        nickname: 'user1',
        avatarUrl: 'http://example.com',
      },
      {
        userId: 2,
        nickname: 'user2',
        avatarUrl: 'http://example.com',
      },
    ] as UserDto[],
    type: UserDto,
    isArray: true,
  })
  onlineUsers: UserDto[];
}
