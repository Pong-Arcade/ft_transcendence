import { ApiProperty } from '@nestjs/swagger';
import { MatchType } from 'src/enum/match.type.enum';

export class GameStatDto {
  @ApiProperty({
    description: '게임 종류',
    example: MatchType.NORMAL,
    enum: MatchType,
  })
  matchType: MatchType;

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
