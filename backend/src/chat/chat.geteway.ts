import {
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { User } from '../status/status.entity';
import { Room } from './chatroom.entity';
import { Namespace, Socket } from 'socket.io';
import { OnEvent } from '@nestjs/event-emitter';
import { MockRepository } from 'src/mock/mock.repository';
import { ChatroomCreateRequestDto } from 'src/dto/request/chatroom.create.request.dto';
import { UserService } from 'src/user/user.service';
import { Logger, UnauthorizedException } from '@nestjs/common';
import { ChangeChatroomInfoRequestDto } from 'src/dto/request/chatroom.change.info.request.dto';
import { UserChatMode } from 'src/enum/user.chat.mode.enum';
import { ChatRoomMode } from 'src/enum/chatroom.mode.enum';
import { GameRoomService } from 'src/game/gameroom.service';
import { users } from 'src/status/status.module';
import { JwtService } from '@nestjs/jwt';
export const rooms = new Map<number, Room>();
let roomCount = 1;

type MessageType = 'message' | 'whisper' | 'systemMsg';
interface IMessage {
  fromId: number;
  content: string;
  type: MessageType;
  roomId?: number;
}
enum EMessageType {
  MESSAGE = 'message',
  WHISPER = 'whisper',
  SYSTEMMSG = 'systemMsg',
}
@WebSocketGateway({
  namespace: 'socket/chat',
  cors: { origin: process.env.FE_HOST },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private logger = new Logger(ChatGateway.name);
  mock = new MockRepository();
  muteUsers = new Array<number>();

  constructor(
    private readonly userService: UserService,
    private readonly gameRoomService: GameRoomService,
    private readonly jwtService: JwtService,
  ) {}

  @WebSocketServer() server: Namespace;
  async handleConnection(@ConnectedSocket() socket: Socket) {
    this.logger.log(`Called ${this.handleConnection.name}`);
    try {
      const token = socket.handshake.auth.token;
      this.jwtService.verify(token);
    } catch (err) {
      const error = new UnauthorizedException();
      socket.emit('connect_unauth_error', error);
      socket.disconnect(true);
      return;
    }
    socket.join('lobby');
  }

  //연결 끊김
  async handleDisconnect(socket) {
    this.logger.log(`Called ${this.handleDisconnect.name}`);
    for (const [userId, user] of users) {
      if (socket.id !== user.socketId) {
        continue;
      }
      // Leave chatroom
      if (user.location > 0) {
        const chatRoom = rooms.get(user.location);
        this.leaveChatRoom(chatRoom.roomId, userId);
      }
      // Disconnect from game room
      else {
        this.gameRoomService.disconnectUser(user);
      }
      // Delete the user
      users.delete(userId);
      this.mock.deleteOnlineUser(userId);
      this.server.to('lobby').emit('deleteOnlineUser', userId);
      break;
    }
  }

  @SubscribeMessage('addUser')
  async onAddUser(client, info) {
    this.logger.log(`Called ${this.onAddUser.name}`);

    // 로비 채팅방 객체 생성
    if (rooms.size == 0) rooms.set(0, new Room(0, 'lobby'));
    if (info.userId < 0) return;
    // 유저 객체 생성 및 socketId 저장
    let user: User;
    if (users.has(info.userId)) {
      user = users.get(info.userId);
      if (user.userName !== info.userName) {
        this.server.to('lobby').emit('deleteOnlineUser', user.userId);
        user.userName = info.userName;
      }
      if (user.socketId !== client.id) {
        const gameId = user.gameSocketId;
        const chatId = user.socketId;
        await this.handleDisconnect({ id: user.socketId });
        user = new User(info.userId, info.userName);
        user.gameSocketId = gameId;
        this.server.to(chatId).emit('otherLogin');
      }
    } else {
      user = new User(info.userId, info.userName);
    }
    user.socketId = client.id;
    user.mode = UserChatMode.NORMAL;
    users.set(info.userId, user);

    // 로비 채팅방에 유저 추가
    this.mock.patchOnlineUser(info.userId);
    this.server.to('lobby').emit('addOnlineUser', {
      userId: info.userId,
      nickname: info.userName,
    });
  }

  @SubscribeMessage('message')
  onMessage(_, msg) {
    const user = users.get(msg.userId);
    if (!user) return;
    const room = rooms.get(user.location);
    if (!room) return;
    const message: IMessage = {
      fromId: msg.userId,
      content: msg.msg,
      type: EMessageType.MESSAGE,
      roomId: room.roomId,
    };
    if (msg.msg.split(':')[1].length > 64) {
      message.content = '64자 이상으로 입력할 수 없습니다.';
      message.type = EMessageType.SYSTEMMSG;
      this.server.in(_.id).emit('systemMsg', message);
      return;
    }
    if (room.roomId === 0) {
      this.server.to('lobby').emit('message', message);
    } else {
      if (this.muteUsers.find((value) => value == msg.userId)) {
        return;
      }
      this.server.to(`chatroom${message.roomId}`).emit('message', message);
    }
  }

  @SubscribeMessage('whisper')
  onWhisper(client, msg) {
    if (msg.fromName == msg.toName) {
      return;
    }
    if (msg.msg.length >= 64) {
      msg.content = '64자 이상으로 입력할 수 없습니다.';
      msg.type = EMessageType.SYSTEMMSG;
      this.server.in(client.id).emit('systemMsg', msg);
      return;
    }
    for (const value of users.values()) {
      if (value.userName == msg.toName) {
        const toWhisperMsg: IMessage = {
          fromId: msg.fromId,
          content: `${msg.toName}에게: ${msg.msg}`,
          type: EMessageType.WHISPER,
        };
        const fromWhisperMsg: IMessage = {
          fromId: msg.fromId,
          content: `${msg.fromName}로부터: ${msg.msg}`,
          type: EMessageType.WHISPER,
        };
        this.server.to(client.id).emit('whisper', toWhisperMsg);
        this.server.to(value.socketId).emit('whisper', fromWhisperMsg);
        return;
      }
    }
    const message: IMessage = {
      fromId: msg.fromId,
      content: '접속중이지 않은 유저입니다.',
      type: EMessageType.SYSTEMMSG,
    };
    this.server.to(client.id).emit('systemMsg', message);
  }

  @OnEvent('chatroom:join')
  async joinChatRoom(roomId: number, userId: number) {
    const room = rooms.get(roomId);
    const user = users.get(userId);
    if (!room || !user) return;
    user.location = roomId;
    if (!user.mode) user.mode = UserChatMode.NORMAL;
    this.server.to(user.socketId).socketsLeave('lobby');
    this.server.to(user.socketId).socketsJoin(`chatroom${roomId}`);
    const userInfo = await this.userService.getUserInfo(userId);
    if (user.mode !== UserChatMode.MASTER) room.users.push(userId);
    this.server.in(`chatroom${roomId}`).emit('joinChatRoom', {
      userId: userId,
      nickname: user.userName,
      avatarUrl: userInfo.avatarUrl,
      email: userInfo.email,
      mode: user.mode,
      firstLogin: userInfo.firstLogin,
    });
    const message: IMessage = {
      fromId: userId,
      content: user.userName + '님이 입장하였습니다.',
      type: EMessageType.SYSTEMMSG,
    };
    this.server.in(`chatroom${roomId}`).emit('systemMsg', message);
  }

  @OnEvent('chatroom:leave')
  leaveChatRoom(roomId: number, userId: number) {
    const room = rooms.get(roomId);
    if (!room) return;
    if (room.masterUser === userId) {
      this.server.in(`chatroom${roomId}`).emit('destructChatRoom');
      this.server.in(`chatroom${roomId}`).socketsJoin('lobby');
      this.server.in(`chatroom${roomId}`).socketsLeave(`chatroom${roomId}`);
      this.server.in('lobby').emit('deleteChatRoom', roomId);
      room.users.map((id) => {
        const user = users.get(id);
        if (user) {
          user.location = 0;
          user.mode = UserChatMode.NORMAL;
        }
      });
      rooms.delete(roomId);
    } else {
      const user = users.get(userId);
      if (!user) return;
      user.location = 0;
      user.mode = UserChatMode.NORMAL;
      room.adminUsers = room.adminUsers.filter((uid) => uid !== userId);
      this.server.in(`chatroom${roomId}`).emit('leaveChatRoom', userId);
      this.server.in(user.socketId).socketsLeave(`chatroom${roomId}`);
      this.server.in(user.socketId).socketsJoin('lobby');
      room.users = room.users.filter((id) => id != userId);
      const message: IMessage = {
        fromId: userId,
        content: user.userName + '님이 퇴장하였습니다.',
        type: EMessageType.SYSTEMMSG,
      };
      this.server.in(`chatroom${roomId}`).emit('systemMsg', message);
    }
    if (room.users.length == 0) {
      rooms.delete(roomId);
      this.server.in('lobby').emit('deleteChatRoom', roomId);
    }
  }

  @OnEvent('chatroom:create')
  addChatRoom(userId: number, roomInfo: ChatroomCreateRequestDto) {
    const roomId = roomCount++;
    const user = users.get(userId);
    if (!user) return;
    user.mode = UserChatMode.MASTER;
    const room = new Room(
      roomId,
      roomInfo.title,
      roomInfo.mode,
      roomInfo.password,
      roomInfo.maxUserCount,
      userId,
    );

    user.location = roomId;
    this.server.to(user.socketId).socketsLeave('lobby');
    this.server.to(user.socketId).socketsJoin(`chatroom${roomId}`);
    rooms.set(roomId, room);
    rooms.get(roomId).users.push(userId);
    this.server.in('lobby').emit('addChatRoom', {
      roomId: room.roomId,
      title: room.title,
      mode: room.mode,
      maxUserCount: room.maxUser,
      currentCount: 1,
    });
  }

  @OnEvent('chatroom:invite')
  inviteChatRoom(roomId: number, fromId: number, toUsers: number[]) {
    const room = rooms.get(roomId);
    if (!room) return;
    const userName = users.get(fromId).userName;
    const to = new Array<User>();
    for (const id of toUsers) {
      to.push(users.get(id));
    }
    to.forEach((user) => {
      this.server.to(user.socketId).emit('inviteChatRoom', roomId, userName);
      room.invitedUsers.push(user.userId);
    });
  }
  @OnEvent('chatroom:invite:accept')
  async acceptInviteChatRoom(roomId: number, userId: number) {
    const room = rooms.get(roomId);
    if (!room) return;
    await this.joinChatRoom(roomId, userId);
    room.invitedUsers = room.invitedUsers.filter((id) => id != userId);
  }

  @OnEvent('chatroom:invite:reject')
  rejectInviteChatRoom(roomId: number, userId: number) {
    const room = rooms.get(roomId);
    if (!room) return;
    room.invitedUsers = room.invitedUsers.filter((id) => id != userId);
  }
  @OnEvent('chatroom:ban')
  banChatRoom(roomId: number, userId: number) {
    const room = rooms.get(roomId);
    const user = users.get(userId);
    if (!room || !user) return;
    this.server.to(user.socketId).emit('banChatRoom', roomId);
    room.bannedUsers.push(userId);
    this.leaveChatRoom(roomId, userId);
  }
  @OnEvent('chatroom:promote-admin')
  addAdmin(roomId: number, userId: number) {
    const room = rooms.get(roomId);
    const user = users.get(userId);
    if (!room || !user) return;
    room.adminUsers.push(userId);
    user.mode = UserChatMode.ADMIN;
    this.server.in(`chatroom${roomId}`).emit('addAdmin', userId);
  }
  @OnEvent('chatroom:demote-admin')
  deleteAdmin(roomId: number, userId: number) {
    const room = rooms.get(roomId);
    const user = users.get(userId);
    if (!room || !user) return;
    room.adminUsers = room.adminUsers.filter((id) => id !== userId);
    user.mode = UserChatMode.NORMAL;
    this.server.in(`chatroom${roomId}`).emit('deleteAdmin', userId);
  }
  @OnEvent('chatroom:mute-user')
  muteUser(roomId: number, userId: number, duration: number) {
    this.muteUsers.push(userId);
    const user = users.get(userId);
    if (!user) return;
    const message: IMessage = {
      fromId: userId,
      content: user.userName + '님이 채팅금지 당하셨습니다.',
      type: EMessageType.SYSTEMMSG,
    };
    this.server.in(`chatroom${roomId}`).emit('systemMsg', message);
    setTimeout(() => this.unmuteUser(roomId, userId), duration * 1000);
  }
  @OnEvent('chatroom:unmute-user')
  unmuteUser(roomId: number, userId: number) {
    if (!(roomId && userId)) return;
    const user = users.get(userId);
    if (!user) return;
    const message: IMessage = {
      fromId: userId,
      content: user.userName + '님의 채팅금지가 해제되었습니다.',
      type: EMessageType.SYSTEMMSG,
    };
    if (this.muteUsers.includes(userId)) {
      this.muteUsers = this.muteUsers.filter((uid) => uid !== userId);
      this.server.in(`chatroom${roomId}`).emit('systemMsg', message);
    }
  }

  @OnEvent('chatroom:change-info')
  updateChatRoom(roomId: number, roomInfo: ChangeChatroomInfoRequestDto) {
    const room = rooms.get(roomId);
    if (!room) return;
    room.title = roomInfo.title;
    room.mode = roomInfo.mode;
    if (roomInfo.password || room.mode != ChatRoomMode.PUBLIC)
      room.password = roomInfo.password;
    this.server.in('lobby').emit('updateChatRoom', {
      roomId: room.roomId,
      title: room.title,
      mode: room.mode,
      maxUserCount: room.maxUser,
      currentCount: room.users.length,
    });
    this.server.in('chatroom' + roomId).emit('updateChatRoom', room.title);
  }
}
