import { ApiProperty } from '@nestjs/swagger';
import { MatchType } from 'src/enum/match.type.enum';

export class MatchHistoryDto {
  @ApiProperty({
    description: '레드팀 유저 ID',
    example: 1,
  })
  redUserId: number;

  @ApiProperty({
    description: '블루 유저 ID',
    example: 1,
  })
  blueUserId: number;

  @ApiProperty({
    description: '레드팀 점수',
    example: 10,
  })
  redScore: number;

  @ApiProperty({
    description: '블루팀 점수',
    example: 9,
  })
  blueScore: number;

  @ApiProperty({
    description: '게임 시작 시간',
    example: '2021-08-01 00:00:00',
  })
  beginDate: Date;

  @ApiProperty({
    description: '게임 종료 시간',
    example: '2021-08-01 00:00:00',
  })
  endDate: Date;

  @ApiProperty({
    description: '대전 유형',
    example: MatchType.LADDER,
    enum: MatchType,
  })
  matchType: MatchType;
}
