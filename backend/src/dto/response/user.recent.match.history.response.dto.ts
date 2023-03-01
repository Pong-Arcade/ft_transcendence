import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from '../user.dto';
import { MatchResult } from 'src/enum/match.result.enum';
import { MatchType } from 'src/enum/match.type.enum';
import { MyMatchHistoryDto } from '../my.match.history.dto';

/**
 * 유저의 최근 전적 기록을 반환하는 dto입니다.
 * userInfo는 검색한 유저의 정보를 저장합니다.
 * matchHistories는 검색한 유저의 최근 전적 기록을 저장합니다.
 */
export class UserRecentMatchHistoryResponseDto {
  @ApiProperty({
    description: '검색한 유저의 정보',
    example: {
      userId: 1,
      nickname: 'user',
      avatarUrl: 'http://example.com',
    } as UserDto,
    type: UserDto,
  })
  userInfo: UserDto;

  @ApiProperty({
    description: '검색한 유저의 최근 전적 기록',
    example: [
      {
        matchId: 1,
        matchResult: MatchResult.WIN,
        opponent: {
          userId: 2,
          nickname: 'opponentUser',
          avatarUrl: 'http://example.com',
        } as UserDto,
        myScore: 10,
        opponentScore: 5,
        beginDate: new Date('2023-02-15T00:00:00.000Z'),
        matchTime: 282000,
        matchType: MatchType.LADDER,
      },
      {
        matchId: 2,
        matchResult: MatchResult.LOSE,
        opponent: {
          userId: 3,
          nickname: 'opponentUser2',
          avatarUrl: 'http://example.com',
        } as UserDto,
        myScore: 5,
        opponentScore: 10,
        beginDate: new Date('2023-02-15T00:00:00.000Z'),
        matchTime: 272000,
        matchType: MatchType.LADDER,
      },
    ] as MyMatchHistoryDto[],
    type: MyMatchHistoryDto,
    isArray: true,
  })
  matchHistories: MyMatchHistoryDto[];
}
