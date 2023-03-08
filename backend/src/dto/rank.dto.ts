import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from './user.dto';

/**
 * 순위 정보를 저장하는 dto입니다.
 */
export class RankDto {
  @ApiProperty({
    description: '순위',
    example: 1,
  })
  ranking: number;

  @ApiProperty({
    description: '유저 정보',
    example: {
      userId: 1,
      nickname: 'user1',
      avatarUrl: 'http://example.com',
    } as UserDto,
    type: UserDto,
  })
  userInfo: UserDto;

  @ApiProperty({
    description: '래더 점수',
    example: 1000,
  })
  ladderScore: number;

  @ApiProperty({
    description: '승리 횟수',
    example: 9,
  })
  winCount: number;

  @ApiProperty({
    description: '패배 횟수',
    example: 1,
  })
  loseCount: number;

  @ApiProperty({
    description: '승률',
    example: 90,
  })
  winRate: number;
}
