import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from '../user.dto';

/**
 * 유저의 친구 목록을 반환하는 dto입니다.
 * friendList는 친구의 유저정보 리스트를 저장합니다.
 */
export class UserFriendListResponseDto {
  @ApiProperty({
    description: '친구의 유저정보 리스트',
    example: [
      {
        userId: 1,
        nickname: 'friendUser1',
        avatarUrl: 'http://example.com',
      },
      {
        userId: 2,
        nickname: 'friendUser2',
        avatarUrl: 'http://example.com',
      },
    ] as UserDto[],
    type: UserDto,
    isArray: true,
  })
  friendUsers: UserDto[];
}
