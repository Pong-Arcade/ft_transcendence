import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { users } from './status.module';
import { User } from './status.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { GameRoomService } from 'src/game/gameroom.service';
import { ChatroomService } from 'src/chat/chat.service';

@Injectable()
export class StatusService {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    // @Inject(forwardRef(() => GameRoomService))
    private readonly gameRoomService: GameRoomService,
    // @Inject(forwardRef(() => ChatroomService))
    private readonly chatRoomService: ChatroomService,
  ) {}

  /**
   * 모든 유저의 소켓 정보를 가져옴
   * @param socketId
   * @returns
   */
  getAllUserSocketInof(): Map<number, User> {
    return users;
  }

  /**
   * 소켓 ID로 유저의 소켓 정보를 가져옴
   * @param socketId
   * @returns
   */
  getUserSocketInfoBySocketId(socketId: string): User {
    for (const user of users.values()) {
      if (user.socketId === socketId) {
        return user;
      }
    }
    return null;
  }

  /**
   * 유저 ID로 유저의 소켓 정보를 가져옴
   * @param userId
   * @returns
   */
  getUserSocketInfoByUserId(userId: number): User {
    return users.get(userId);
  }

  /**
   * 유저의 소켓 정보를 저장
   * @param userId
   * @param user
   */
  setUserSocketInfo(userId: number, user: User): void {
    users.set(user.userId, user);
  }

  /**
   * 유저가 온라인 상태인지 확인
   * @param userId
   */
  isOnline(userId: number): boolean {
    return users.has(userId);
  }

  /**
   * 유저의 소켓 정보를 삭제
   * 입장한 방이 있는 경우 방을 나가는 이벤트를 발생시킴
   * @param userId
   */
  deleteUserSocketInfo(userId: number): void {
    const user = users.get(userId);
    if (user) {
      if (user.location > 0) {
        const chatRoom = this.chatRoomService.getMyChatroomInfo(user.userId);
        this.eventEmitter.emit('chatroom:leave', chatRoom.roomId, userId);
      } else if (user.location < 0) {
        const gameRoomId = this.gameRoomService.getMyGameRoomId(user.userId);
        this.eventEmitter.emit('gameroom:leave', gameRoomId, userId);
      }
      users.delete(userId);
    }
  }
}
