import { Injectable } from '@nestjs/common';
import { OnlineUsersResponseDto } from '../dto/response/online.users.response.dto';
import { UserFriendListResponseDto } from '../dto/response/user.friend.list.response.dto';
import { UserBlockListResponseDto } from '../dto/response/user.block.list.response.dto';

@Injectable()
export class MockRepository {
  getOnlineUser(USER_NUM: number) {
    let ret: OnlineUsersResponseDto;
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
    let ret: UserFriendListResponseDto;
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
    let ret: UserBlockListResponseDto;
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
}
