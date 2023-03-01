import { Injectable, Logger } from '@nestjs/common';
import { GameRoomListResponseDto } from 'src/dto/response/gameroom.list.response.dto';
import { gameRooms, invitations } from './game.gateway';
import { UserService } from 'src/user/user.service';
import { GameRoom } from './gameroom.entity';
import { GameRoomUsersInfoResponseDto } from 'src/dto/response/gameroom.users.info.response.dto';
import { MatchType } from 'src/enum/match.type.enum';
import { EventEmitter2 } from '@nestjs/event-emitter';

const quickMatchQueues = {
  [MatchType.NORMAL]: new Array<number>(),
  [MatchType.LADDER]: new Array<number>(),
};

@Injectable()
export class GameRoomService {
  private logger = new Logger(GameRoomService.name);

  constructor(
    private readonly userService: UserService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  /**
   * 전체 게임방 목록을 조회합니다.
   * 로비에서도 게임방에 있는 유저의 정보를 조회할 수 있어야 하므로
   * 게임방에 있는 유저의 정보를 DB에서 조회하는 로직이 포함되어 있습니다.
   * @returns 전체 게임방 목록
   */
  async getAllGameRooms(): Promise<GameRoomListResponseDto> {
    this.logger.log(`Called ${this.getAllGameRooms.name}`);
    const rooms = new GameRoomListResponseDto();
    rooms.gameRooms = [];
    for (const [roomId, room] of gameRooms.entries()) {
      rooms.gameRooms.push({
        roomId: roomId,
        redUser: room.redUser
          ? await this.userService.getUserInfo(room.redUser.userId)
          : null,
        blueUser: room.blueUser
          ? await this.userService.getUserInfo(room.blueUser.userId)
          : null,
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
    const redUser = gameRoomInfo.redUser
      ? {
          ...(await this.userService.getUserInfo(gameRoomInfo.redUser.userId)),
          gameUserStatus: gameRoomInfo.redUser.gameUserStatus,
        }
      : null;
    const blueUser = gameRoomInfo.blueUser
      ? {
          ...(await this.userService.getUserInfo(gameRoomInfo.blueUser.userId)),
          gameUserStatus: gameRoomInfo.blueUser.gameUserStatus,
        }
      : null;

    const gameRoomUsersInfo: GameRoomUsersInfoResponseDto = {
      roomId: gameRoomInfo.roomId,
      redUser: redUser,
      blueUser: blueUser,
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
   * @returnshat
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
  isOnThatGameRoom(roomId: number, userId: number): boolean {
    this.logger.log(`Called ${this.isOnThatGameRoom.name}`);
    const room = gameRooms.get(roomId);
    if (room) {
      if (
        room.redUser?.userId === userId ||
        room.blueUser?.userId === userId ||
        room.spectatorUsers.includes(userId)
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
        room.redUser?.userId === userId ||
        room.blueUser?.userId === userId ||
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
      if (room.redUser?.userId && room.blueUser?.userId) {
        return 2;
      } else if (room.redUser?.userId) {
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
      if (room.redUser?.userId === userId) {
        return room.roomId;
      }
    }
    return null;
  }

  /**
   * 자신이 초대자인지 확인합니다.
   * 초대자인 경우 true를 반환합니다.
   * 초대자가 아닌 경우 false를 반환합니다.
   * @param userId
   * @returns
   */
  isInviter(userId: number): boolean {
    this.logger.log(`Called ${this.isInviter.name}`);
    for (const invitation of invitations) {
      if (invitation.inviterId === userId) {
        return true;
      }
    }
    return false;
  }

  /**
   * 자신이 초대받은 유저인지 확인합니다.
   * 초대받은 유저인 경우 true를 반환합니다.
   * 초대받은 유저가 아닌 경우 false를 반환합니다.
   * @param userId
   * @returns
   */
  isInvitee(userId: number): boolean {
    this.logger.log(`Called ${this.isInvitee.name}`);
    for (const invitation of invitations) {
      if (invitation.inviteeId === userId) {
        return true;
      }
    }
    return false;
  }

  /**
   * 자신이 래더게임 빠른 대전 대기열에 있는지 확인합니다.
   * 래더게임 빠른 대전 대기열에 있는 경우 true를 반환합니다.
   * 래더게임 빠른 대전 대기열에 없는 경우 false를 반환합니다.
   * @param userId
   * @returns
   */
  isInLadderQuickMatchQueue(userId: number): boolean {
    this.logger.log(`Called ${this.isInLadderQuickMatchQueue.name}`);
    return quickMatchQueues[MatchType.LADDER].includes(userId);
  }

  /**
   * 자신이 일반게임 빠른 대전 대기열에 있는지 확인합니다.
   * 일반게임 빠른 대전 대기열에 있는 경우 true를 반환합니다.
   * 일반게임 빠른 대전 대기열에 없는 경우 false를 반환합니다.
   * @param userId
   * @returns
   */
  isInNormalQuickMatchQueue(userId: number): boolean {
    this.logger.log(`Called ${this.isInNormalQuickMatchQueue.name}`);
    return quickMatchQueues[MatchType.NORMAL].includes(userId);
  }

  /**
   * 빠른 대전 대기열에 자신을 추가합니다.
   * @param userId
   * @param matchType
   */
  joinQuickMatchQueue(userId: number, matchType: MatchType): void {
    this.logger.log(`Called ${this.joinQuickMatchQueue.name}`);
    // matchType에 해당하는 매칭 대기열에 userId를 추가
    const queue = quickMatchQueues[matchType];
    queue.push(userId);

    // 매칭 대기열에 2명 이상이 모이면 매칭을 시작
    if (queue.length >= 2) {
      const user1 = queue.shift();
      const user2 = queue.shift();
      // 매칭이 되었다는 이벤트를 발생시킴
      this.eventEmitter.emit('game:matching', user1, user2, matchType);
      // 매칭이 되었다면 두 유저를 매칭 대기열에서 제거
      quickMatchQueues[matchType] = quickMatchQueues[matchType].filter(
        (id) => id !== user1 && id !== user2,
      );
    }

    // 매칭 대기열에 2명 이상이 모이지 않으면 1분 후 매칭 대기열에서 제거
    setTimeout(() => {
      quickMatchQueues[matchType] = quickMatchQueues[matchType].filter(
        (id) => id !== userId,
      );
      this.logger.debug(`Removed ${userId} from quick match queue`);
    }, 1000 * 60);
  }

  /**
   * 빠른 대전 대기열에서 자신을 제거합니다.
   * @param userId
   * @param matchType
   */
  leaveQuickMatchQueue(userId: number) {
    this.logger.log(`Called ${this.leaveQuickMatchQueue.name}`);
    // matchType에 해당하는 매칭 대기열에서 userId를 제거
    for (const queue of Object.values(quickMatchQueues)) {
      const index = queue.indexOf(userId);
      if (index !== -1) {
        queue.splice(index, 1);
        break;
      }
    }
  }
}
