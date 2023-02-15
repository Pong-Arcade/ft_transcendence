import { Injectable } from '@nestjs/common';
import { OnlineUsersResponseDto } from '../dto/response/online.users.response.dto';
import { UserFriendListResponseDto } from '../dto/response/user.friend.list.response.dto';
import { UserBlockListResponseDto } from '../dto/response/user.block.list.response.dto';

@Injectable()
export class MockRepository {
  getOnlineUser(USER_NUM: number) {
    const ret = new OnlineUsersResponseDto();
    ret.onlineUsers = [];
    for (let i = 0; i < USER_NUM; ++i) {
      ret.onlineUsers.push({
        userId: i,
        nickname: `onlineUser${i}`,
        avatarUrl: `onlineUser${i}.jpeg`,
        email: `onlineUser${i}@asd.com`,
      });
    }
    return ret;
  }

  getFriendUser(USER_NUM: number) {
    const ret = new UserFriendListResponseDto();
    ret.friendUsers = [];
    for (let i = 0; i < USER_NUM; ++i) {
      ret.friendUsers.push({
        userId: i,
        nickname: `friendUser${i}`,
        avatarUrl: `friendUser${i}.jpeg`,
        email: `friendUser${i}@asd.com`,
      });
    }
    return ret;
  }

  getBlockUser(USER_NUM: number) {
    const ret = new UserBlockListResponseDto();
    ret.blockUsers = [];
    for (let i = 0; i < USER_NUM; ++i) {
      ret.blockUsers.push({
        userId: i,
        nickname: `blockUsers${i}`,
        avatarUrl: `blockUsers${i}.jpeg`,
        email: `blockUsers${i}@asd.com`,
      });
    }
    return ret;
  }

  userInfo = {
    userId: 1,
    nickname: 'sichoi',
    ladderInfo: {
      ladderScore: 1020,
      rank: 13,
      winCount: 3,
      loseCount: 2,
      winRate: 60,
      userStatus: 'ON_LOBBY',
    },
    normalInfo: {
      winCount: 3,
      loseCount: 2,
      winRate: 60,
      userStatus: 'ON_LOBBY',
    },
  };

  getUserInfo() {
    return this.userInfo;
  }
}
