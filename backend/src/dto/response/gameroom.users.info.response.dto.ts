import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from '../user.dto';

/**
 * 게임방에 참여한 유저들의 정보를 반환하는 dto입니다.
 * @property mastUserId 방장의 유저 id
 * @property users 게임방에 참여한 유저들의 정보
 */
export class GameRoomUsersInfoResponseDto {
  @ApiProperty({
    description: '게임방에 참여한 유저들의 정보',
    example: 1,
  })
  roomId: number;

  @ApiProperty({
    description: '레드팀 유저 정보',
    example: {
      userId: 1,
      nickname: 'redUser',
      avatarUrl: 'http://example.com',
    } as UserDto,
  })
  redUser: UserDto;

  @ApiProperty({
    description: '블루팀 유저 정보',
    example: {
      userId: 2,
      nickname: 'blueUser',
      avatarUrl: 'http://example.com',
    } as UserDto,
  })
  blueUser: UserDto;

  @ApiProperty({
    description: '최대 관전자 수',
    example: 10,
  })
  maxSpectatorCount: number;

  @ApiProperty({
    description: '현재 관전자 수',
    example: 5,
  })
  curSpectatorCount: number;
}
