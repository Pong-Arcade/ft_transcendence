import { Injectable } from '@nestjs/common';
import { OnlineUsersResponseDto } from '../dto/response/online.users.response.dto';
import { UserFriendListResponseDto } from '../dto/response/user.friend.list.response.dto';
import { UserBlockListResponseDto } from '../dto/response/user.block.list.response.dto';
import { UserDto } from 'src/dto/user.dto';
import { ChatRoomListDto } from 'src/dto/chatroom.list.dto';
import { ChatRoomMode } from 'src/enum/chatroom.mode.enum';
import { UserChatDto } from 'src/dto/user.chat.dto';
import { ChatroomCreateRequestDto } from 'src/dto/request/chatroom.create.request.dto';

const USER_MOCK_DATA = 38;
const onlineUsers = new OnlineUsersResponseDto();
onlineUsers.onlineUsers = [];
for (let i = 0; i < USER_MOCK_DATA; ++i) {
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

const CHAT_ROOM_MOCK_DATA = 13;
let roomCount = CHAT_ROOM_MOCK_DATA;
const chatRoomList: ChatRoomListDto[] = [];
for (let i = 0; i < CHAT_ROOM_MOCK_DATA; ++i) {
  if (i % 3 === 0) {
    chatRoomList.push({
      roomId: i,
      title: `chatRoom${i}`,
      mode: ChatRoomMode.PUBLIC,
      maxUserCount: 10,
      currentCount: 10,
    });
  } else if (i % 3 === 1) {
    chatRoomList.push({
      roomId: i,
      title: `chatRoom${i}`,
      mode: ChatRoomMode.PROTECTED,
      maxUserCount: 10,
      currentCount: 6,
    });
  } else {
    chatRoomList.push({
      roomId: i,
      title: `chatRoom${i}`,
      mode: ChatRoomMode.PRIVATE,
      maxUserCount: 5,
      currentCount: 3,
    });
  }
}

@Injectable()
export class MockRepository {
  getChatRoomList() {
    return { chatRooms: chatRoomList };
  }
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
  createChatRoom(user: UserDto, value: ChatroomCreateRequestDto) {
    chatRoomList.push({
      roomId: roomCount,
      title: value.title,
      mode: value.mode,
      maxUserCount: value.maxUserCount,
      currentCount: 1,
    });
    return {
      roomId: roomCount++,
      mastUserId: user.userId,
      users: [user as UserChatDto],
    };
  }

  createFriendUser(userId: number) {
    const user: UserDto = {
      userId: userId,
      nickname: `friendUser${userId}`,
      avatarUrl: `friendUser${userId}.jpeg`,
      email: `friendUser${userId}@asd.com`,
    };
    friendUsers.friendUsers.push(user);
  }
  createBlockUser(userId: number) {
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
