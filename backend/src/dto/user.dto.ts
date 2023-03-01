import { ApiProperty } from '@nestjs/swagger';

/**
 * pong 게임 유저의 정보를 저장합니다.
 * avatarUrl은 사용자의 프로필 사진을 저장합니다.
 * email은 사용자의 이메일을 저장합니다.
 * avatarUrl, email, firstLogin 필드는 확장성을 위해 optional로 설정되어 있습니다.
 */
export class UserDto {
  @ApiProperty({
    description: '유저의 ID',
    example: 1,
  })
  userId: number;

  @ApiProperty({
    description: '유저의 닉네임',
    example: 'user1',
  })
  nickname: string;

  @ApiProperty({
    description: '유저의 아바타 이미지 url',
    example: 'http://example.com',
  })
  avatarUrl?: string;

  @ApiProperty({
    description: '유저의 이메일',
    example: 'http://example.email.com',
  })
  email?: string; // 유저의 이메일

  @ApiProperty({
    description: '유저의 첫 로그인 시간',
    example: '2023-02-15T00:00:00.000Z',
    type: Date,
  })
  firstLogin?: Date; // 유저의 첫 로그인 시간

  @ApiProperty({
    description: '유저의 위치 정보',
    example: 0,
  })
  location?: number;
}
