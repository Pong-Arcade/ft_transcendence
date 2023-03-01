import { ApiProperty } from '@nestjs/swagger';
import { GameStatDto } from '../game.stat.dto';
import { MatchType } from 'src/enum/match.type.enum';
import { UserStatusDto } from '../user.status.dto';

/**
 * 유저 상세 정보를 반환하는 dto입니다.
 */
export class UserDetailResponseDto extends UserStatusDto {
  @ApiProperty({
    description: '유저 래더 전적 정보',
    example: {
      matchType: MatchType.LADDER,
      winCount: 9,
      loseCount: 1,
      winRate: 90,
    } as GameStatDto,
    type: GameStatDto,
  })
  ladderInfo: GameStatDto;

  @ApiProperty({
    description: '유저 노말 전적 정보',
    example: {
      matchType: MatchType.NORMAL,
      winCount: 10,
      loseCount: 0,
      winRate: 100,
    } as GameStatDto,
    type: GameStatDto,
  })
  normalInfo: GameStatDto;
}
