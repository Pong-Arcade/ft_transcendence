import { ApiProperty } from '@nestjs/swagger';
import { UserStatus } from '../../enum/user.status.enum';
import { RankDto } from '../rank.dto';

/**
 * 유저 상세 정보를 반환하는 dto입니다.
 */
export class UserDetailResponseDto {
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
