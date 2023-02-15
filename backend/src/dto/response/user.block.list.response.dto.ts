import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from '../user.dto';

/**
 * 유저가 차단한 유저 목록을 반환하는 dto입니다.
 * blockList 차단한 유저정보 리스트를 저장합니다.
 */
export class UserBlockListResponseDto {
  @ApiProperty({
    description: '차단한 유저정보 리스트',
    example: [
      {
        userId: 1,
        nickname: 'blockUser1',
        avatarUrl: 'http://example.com',
      },
      {
        userId: 2,
        nickname: 'blockUser2',
        avatarUrl: 'http://example.com',
      },
    ] as UserDto[],
    type: UserDto,
    isArray: true,
  })
  blockUsers: UserDto[];
}
