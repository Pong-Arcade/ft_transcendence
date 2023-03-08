import { ApiProperty } from '@nestjs/swagger';
import { GameRoomListDto } from '../gameroom.list.dto';
import { GameRoomStatus } from 'src/enum/gameroom.status.enum';
import { GameRoomMode } from 'src/enum/gameroom.mode.enum';

/**
 * 현재 게임방 목록을 반환하는 응답 DTO입니다.
 * gameRooms: 게임방 리스트
 */
export class GameRoomListResponseDto {
  @ApiProperty({
    description: '현재 게임방 목록, 로비에서 확인하는 목록입니다.',
    example: [
      {
        roomId: 1,
        redUser: {
          userId: 1,
          nickname: 'redUser',
          avatarUrl: 'http://example.com',
        },
        blueUser: {
          userId: 2,
          nickname: 'blueUser',
          avatarUrl: 'http://example.com',
        },
        maxSpectatorCount: 10,
        curSpectatorCount: 5,
        roomStatus: GameRoomStatus.ON_READY,
        title: '게임방 제목입니다.',
        mode: GameRoomMode.POWER_UP,
      },
      {
        roomId: 2,
        redUser: {
          userId: 3,
          nickname: 'redUser2',
          avatarUrl: 'http://example.com',
        },
        blueUser: {
          userId: 4,
          nickname: 'blueUser2',
          avatarUrl: 'http://example.com',
        },
        maxSpectatorCount: 10,
        curSpectatorCount: 7,
        roomStatus: GameRoomStatus.ON_GAME,
        title: '게임방 제목입니다.',
        mode: GameRoomMode.NORMAL,
      },
    ] as GameRoomListDto[],
    type: GameRoomListDto,
    isArray: true,
  })
  gameRooms: GameRoomListDto[];
}
