import { ApiProperty } from '@nestjs/swagger';
import { RankDto } from '../rank.dto';

/**
 * 순위 정보를 반환하는 dto입니다.
 * ranklist는 순위 정보 리스트를 저장합니다.
 */
export class RankListResponseDto {
  @ApiProperty({
    description: '순위 정보 리스트',
    example: [
      {
        ranking: 1,
        userInfo: {
          userId: 1,
          nickname: 'user1',
          avatarUrl: 'http://example.com',
        },
        ladderScore: 1000,
        winCount: 9,
        loseCount: 1,
        winRate: 90,
      },
      {
        ranking: 2,
        userInfo: {
          userId: 2,
          nickname: 'user2',
          avatarUrl: 'http://example.com',
        },
        ladderScore: 900,
        winCount: 8,
        loseCount: 2,
        winRate: 80,
      },
    ] as RankDto[],
    type: RankDto,
    isArray: true,
  })
  rankList: RankDto[];
}
