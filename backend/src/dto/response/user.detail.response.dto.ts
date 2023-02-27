import { ApiProperty } from '@nestjs/swagger';
import { UserStatus } from '../../enum/user.status.enum';
import { RankDto } from '../rank.dto';

/**
 * 유저 상세 정보를 반환하는 dto입니다.
 */
export class UserDetailResponseDto {
  @ApiProperty({
    description: '유저 id',
    example: 1,
  })
  userId: number;

  @ApiProperty({
    description: '유저 intraId',
    example: 'sichoi',
  })
  intraId: string;

  @ApiProperty({
    description: '유저 래더 정보',
    example: {
      ladderScore: 1020,
      rank: 13,
      winCount: 3,
      loseCount: 2,
      winRate: 60,
    },
    type: RankDto,
  })
  ladderInfo;

  @ApiProperty({
    description: '유저 상태',
    example: UserStatus.ONLINE,
  })
  userStatus: UserStatus;
}
