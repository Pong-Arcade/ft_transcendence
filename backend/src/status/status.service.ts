import { Injectable } from '@nestjs/common';
import { users } from './status.module';
import { User } from './status.entity';

@Injectable()
export class StatusService {
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
}
