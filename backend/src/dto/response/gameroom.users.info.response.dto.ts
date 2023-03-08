import { ApiProperty } from '@nestjs/swagger';
import { GameRoomMode } from 'src/enum/gameroom.mode.enum';
import { GameUserStatusDto } from '../game.user.status.dto';
import { GameRoomUserStatus } from 'src/enum/gameroom.user.status.enum';

/**
 * 게임방에 참여한 유저들의 정보를 반환하는 dto입니다.
 * @property mastUserId 방장의 유저 id
 * @property users 게임방에 참여한 유저들의 정보
 */
export class GameRoomUsersInfoResponseDto {
  @ApiProperty({
    description: '게임방 ID',
    example: 1,
  })
  roomId: number;

  @ApiProperty({
    description: '레드팀 유저 정보',
    example: {
      userId: 1,
      nickname: 'redUser',
      avatarUrl: 'http://example.com',
      gameUserStatus: GameRoomUserStatus.UN_READY,
    } as GameUserStatusDto,
  })
  redUser: GameUserStatusDto;

  @ApiProperty({
    description: '블루팀 유저 정보',
    example: {
      userId: 2,
      nickname: 'blueUser',
      avatarUrl: 'http://example.com',
      gameUserStatus: GameRoomUserStatus.UN_READY,
    } as GameUserStatusDto,
  })
  blueUser: GameUserStatusDto;

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
