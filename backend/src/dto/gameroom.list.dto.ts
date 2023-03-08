import { GameRoomStatus } from 'src/enum/gameroom.status.enum';
import { UserDto } from './user.dto';
import { ApiProperty } from '@nestjs/swagger';
import { GameRoomMode } from 'src/enum/gameroom.mode.enum';

/**
 * 게임방 목록을 반환하는 dto입니다.
 */
export class GameRoomListDto {
  @ApiProperty({
    description: '게임방 ID',
    example: 1,
  })
  roomId: number;

  @ApiProperty({
    description: '빨간 팀 유저',
    example: {
      userId: 1,
      nickname: 'redUser',
      avatarUrl: 'http://example.com',
    } as UserDto,
    type: UserDto,
  })
  redUser: UserDto;

  @ApiProperty({
    description: '파란 팀 유저',
    example: {
      userId: 2,
      nickname: 'blueUser',
      avatarUrl: 'http://example.com',
    } as UserDto,
    type: UserDto,
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

  @ApiProperty({
    description: '게임방 상태(게임중/대기중)',
    example: GameRoomStatus.ON_GAME,
    enum: GameRoomStatus,
  })
  roomStatus: GameRoomStatus;

  @ApiProperty({
    description: '게임방 제목',
    example: '게임방 제목입니다.',
  })
  title: string;

  @ApiProperty({
    description: '게임방 모드 (파워업/일반)',
    example: GameRoomMode.POWER_UP,
    enum: GameRoomMode,
  })
  mode: GameRoomMode;
}
