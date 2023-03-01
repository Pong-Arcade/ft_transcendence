import { MatchResult } from 'src/enum/match.result.enum';
import { UserDto } from './user.dto';
import { MatchType } from 'src/enum/match.type.enum';
import { ApiProperty } from '@nestjs/swagger';

/**
 * 자신의 대전 기록을 저장하는 dto입니다.
 */
export class MyMatchHistoryDto {
  @ApiProperty({
    description: '대전의 고유 아이디',
    example: 1,
  })
  matchId: number;

  @ApiProperty({
    description: '대전의 결과',
    example: MatchResult.WIN,
    enum: MatchResult,
  })
  matchResult: MatchResult;

  @ApiProperty({
    description: '대전 상대 유저 정보',
    example: {
      userId: 2,
      nickname: 'opponentUser',
      avatarUrl: 'http://example.com',
    } as UserDto,
    type: UserDto,
  })
  opponent: UserDto;

  @ApiProperty({
    description: '내 점수',
    example: 10,
  })
  myScore: number;

  @ApiProperty({
    description: '상대 점수',
    example: 5,
  })
  opponentScore: number;

  @ApiProperty({
    description: '대전 시작 시간',
    example: '2023-02-15T00:00:00.000Z',
    type: Date,
  })
  beginDate: Date;

  @ApiProperty({
    description: '대전 시간(ms)',
    example: 1000,
  })
  matchTime: number;

  @ApiProperty({
    description: '대전 유형(래더/일반)',
    example: MatchType.LADDER,
    enum: MatchType,
  })
  matchType: MatchType;
}
