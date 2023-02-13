import { Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GameGateway } from './game.gateway';
import { GameRoomListResponseDto } from '../dto/response/gameroom.list.response.dto';
import { GameRoomStatus } from '../enum/gameroom.status.enum';
import { UserDto } from '../dto/user.dto';

const red: UserDto = {
  userId: 1,
  nickname: 'youngparRed',
};
const blue: UserDto = {
  userId: 2,
  nickname: 'youngparBlue',
};
const gameRoomDetail = { red, blue };
const gameRoomList: GameRoomListResponseDto = {
  gameRooms: [
    {
      roomId: 1,
      redUser: red,
      blueUser: blue,
      maxSpectatorCount: 10,
      curSpectatorCount: 3,
      roomStatus: GameRoomStatus.ON_GAME,
    },
    {
      roomId: 2,
      redUser: {
        userId: 3,
        nickname: 'youngpar2',
      },
      blueUser: {
        userId: 4,
        nickname: 'hihi2',
      },
      maxSpectatorCount: 5,
      curSpectatorCount: 2,
      roomStatus: GameRoomStatus.ON_READY,
    },
  ],
};

@ApiTags('Game')
@Controller('api/game-rooms')
export class GameController {
  constructor(private gameGateway: GameGateway) {}

  @ApiOperation({
    summary: '게임중인 방 목록',
    description: '게임이 진행중인 모든 방 목록을 조회',
  })
  @Get()
  getGameList() {
    return gameRoomList;
  }

  @ApiOperation({
    summary: '게임방 상세',
    description: '해당 게임방의 유저 목록 확인',
  })
  @Get(':room-id')
  getGameRoom(@Param('room-id') roomId: number) {
    return gameRoomDetail;
  }
}
