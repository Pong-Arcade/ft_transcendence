import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { GameRoomListResponseDto } from 'src/dto/response/gameroom.list.response.dto';
import { gameRooms } from './game.gateway';
import { UserService } from 'src/user/user.service';
import { GameRoom } from './gameroom.entity';
import { GameRoomUsersInfoResponseDto } from 'src/dto/response/gameroom.users.info.response.dto';

@Injectable()
export class GameRoomService {
  private logger = new Logger(GameRoomService.name);

  constructor(private readonly userService: UserService) {}

  /**
   * 전체 게임방 목록을 조회합니다.
   * 로비에서도 게임방에 있는 유저의 정보를 조회할 수 있어야 하므로
   * 게임방에 있는 유저의 정보를 DB에서 조회하는 로직이 포함되어 있습니다.
   * @returns 전체 게임방 목록
   */
  async getAllGameRooms(): Promise<GameRoomListResponseDto> {
    this.logger.log(`Called ${this.getAllGameRooms.name}`);
    const rooms = new GameRoomListResponseDto();
    for (const [roomId, room] of gameRooms.entries()) {
      rooms.gameRooms.push({
        roomId: roomId,
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

  /**
   * 게임방에 속한 유저 정보를 조회합니다.
   * @param gameRoomInfo 게임방 정보
   * @returns 게임방에 속한 유저 정보
   */
  async getGameRoomUsersInfo(
    gameRoomInfo: GameRoom,
  ): Promise<GameRoomUsersInfoResponseDto> {
    this.logger.log(`Called ${this.getGameRoomUsersInfo.name}`);
    const gameRoomUsersInfo: GameRoomUsersInfoResponseDto = {
      roomId: gameRoomInfo.roomId,
      redUser: gameRoomInfo.redUserId
        ? await this.userService.getUserInfo(gameRoomInfo.redUserId)
        : null,
      blueUser: gameRoomInfo.blueUserId
        ? await this.userService.getUserInfo(gameRoomInfo.blueUserId)
        : null,
      maxSpectatorCount: gameRoomInfo.maxSpectatorCount,
      curSpectatorCount: gameRoomInfo.spectatorUsers.length,
      title: gameRoomInfo.title,
      mode: gameRoomInfo.mode,
    };
    return gameRoomUsersInfo;
  }

  /**
   * 해당 게임방의 정보를 조회합니다.
   * @param roomId
   * @returns
   */
  getGameRoomInfo(roomId: number): GameRoom {
    this.logger.log(`Called ${this.getGameRoomInfo.name}`);
    return gameRooms.get(roomId);
  }

  /**
   * 해당 유저가 해당 게임방에 있는지 확인합니다.
   * 관전자로 게임방에 있는 경우에도 true를 반환합니다.
   * @param roomId
   * @param userId
   * @returns
   */
  isOnThatGameRoom(roomId: number, userId): boolean {
    this.logger.log(`Called ${this.isOnThatGameRoom.name}`);
    const room = gameRooms.get(roomId);
    if (room) {
      if (
        room.redUserId === roomId ||
        room.blueUserId === roomId ||
        room.spectatorUsers.includes(roomId)
      ) {
        return true;
      }
    }
    return false;
  }

  /**
   * 해당 유저가 게임방에 있는지 확인합니다.
   * 관전자로 게임방에 있는 경우에도 true를 반환합니다.
   * @param userId
   * @returns
   */
  isOnGameRoom(userId: number): boolean {
    this.logger.log(`Called ${this.isOnGameRoom.name}`);
    for (const room of gameRooms.values()) {
      if (
        room.redUserId === userId ||
        room.blueUserId === userId ||
        room.spectatorUsers.includes(userId)
      ) {
        return true;
      }
    }
    return false;
  }

  /**
   * 게임방의 현재 인원을 조회합니다.
   * 게임방에는 redUser, blueUser, spectatorUsers가 있습니다.
   * redUserId, blueUserId가 있으면 2명이 게임방에 있는 것이고,
   * redUser만 있으면 1명이 게임방에 있는 것입니다.
   * @param roomId
   * @returns
   */
  getGameRoomUserCount(roomId: number): number {
    const room = gameRooms.get(roomId);
    if (room) {
      if (room.redUserId && room.blueUserId) {
        return 2;
      } else if (room.redUserId) {
        return 1;
      }
    }
    return 0;
  }

  /**
   * 자신이 방장인 게임방의 ID를 조회합니다.
   * @param userId 유저 ID
   * @returns 자신이 방장인 게임방의 ID
   *         방장이 아닌 경우 null
   */
  getMyMasterGameRoomId(userId: number): number {
    this.logger.log(`Called ${this.getMyMasterGameRoomId.name}`);
    for (const room of gameRooms.values()) {
      if (room.redUserId === userId) {
        return room.roomId;
      }
    }
    return null;
  }
}
