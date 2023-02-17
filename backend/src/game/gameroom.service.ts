import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { GameRoomListResponseDto } from 'src/dto/response/gameroom.list.response.dto';
import { gameRooms } from './game.gateway';
import { UserDto } from 'src/dto/user.dto';
import { UserService } from 'src/user/user.service';
import { GameRoom } from './gameroom.entity';

@Injectable()
export class GameRoomService {
  private logger = new Logger(GameRoomService.name);

  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly userService: UserService,
  ) {}

  async getAllGameRooms(): Promise<GameRoomListResponseDto> {
    this.logger.log(`Called ${this.getAllGameRooms.name}`);
    const rooms = new GameRoomListResponseDto();
    for (const room of gameRooms.values()) {
      rooms.gameRooms.push({
        roomId: room.roomId,
        redUser: await this.userService.getUserInfo(room.redUserId),
        blueUser: await this.userService.getUserInfo(room.redUserId),
        maxSpectatorCount: room.maxSpectatorCount,
        curSpectatorCount: room.spectatorUsers.length,
        roomStatus: room.status,
        title: room.title,
        mode: room.mode,
      });
    }
    return rooms;
  }

  getGameRoomInfo(roomId: number): GameRoom {
    this.logger.log(`Called ${this.getGameRoomInfo.name}`);
    return gameRooms.get(roomId);
  }
}
