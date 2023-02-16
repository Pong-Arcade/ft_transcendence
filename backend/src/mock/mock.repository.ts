import { Injectable } from '@nestjs/common';
import { OnlineUsersResponseDto } from '../dto/response/online.users.response.dto';
import { UserFriendListResponseDto } from '../dto/response/user.friend.list.response.dto';
import { UserBlockListResponseDto } from '../dto/response/user.block.list.response.dto';
import { UserDto } from 'src/dto/user.dto';

const MOCK_DATA = 36;
const onlineUsers = new OnlineUsersResponseDto();
onlineUsers.onlineUsers = [];
for (let i = 0; i < MOCK_DATA; ++i) {
  onlineUsers.onlineUsers.push({
    userId: i,
    nickname: `onlineUser${i}`,
    avatarUrl: `onlineUser${i}.jpeg`,
    email: `onlineUser${i}@asd.com`,
  });
}
const friendUsers = new UserFriendListResponseDto();
friendUsers.friendUsers = [];
const blockUsers = new UserBlockListResponseDto();
blockUsers.blockUsers = [];
@Injectable()
export class MockRepository {
  getOnlineUser() {
    return onlineUsers;
  }

  getFriendUser() {
    return friendUsers;
  }

  getBlockUser() {
    return blockUsers;
  }

  patchOnlineUser(userId: number) {
    const user: UserDto = {
      userId: userId,
      nickname: `User${userId}`,
      avatarUrl: `onlineUser${userId}.jpeg`,
      email: `onlineUser${userId}@asd.com`,
    };
    onlineUsers.onlineUsers.push(user);
  }
  patchFriendUser(userId: number) {
    const user: UserDto = {
      userId: userId,
      nickname: `friendUser${userId}`,
      avatarUrl: `friendUser${userId}.jpeg`,
      email: `friendUser${userId}@asd.com`,
    };
    friendUsers.friendUsers.push(user);
  }
  patchBlockUser(userId: number) {
    const user: UserDto = {
      userId: userId,
      nickname: `blockUser${userId}`,
      avatarUrl: `blockUser${userId}.jpeg`,
      email: `blockUser${userId}@asd.com`,
    };
    blockUsers.blockUsers.push(user);
  }
  deleteOnlineUser(userId: number) {
    for (let i = 0; i < onlineUsers.onlineUsers.length; ++i) {
      if (onlineUsers.onlineUsers[i].userId === userId) {
        onlineUsers.onlineUsers.splice(i, 1);
        return;
      }
    }
  }
  deleteFriendUser(userId: number) {
    for (let i = 0; i < friendUsers.friendUsers.length; ++i) {
      if (friendUsers.friendUsers[i].userId === userId) {
        friendUsers.friendUsers.splice(i, 1);
        return;
      }
    }
  }
  deleteBlockUser(userId: number) {
    for (let i = 0; i < blockUsers.blockUsers.length; ++i) {
      if (blockUsers.blockUsers[i].userId === userId) {
        blockUsers.blockUsers.splice(i, 1);
        return;
      }
    }
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
