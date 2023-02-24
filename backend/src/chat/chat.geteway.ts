import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { User } from '../status/status.entity';
import { users } from '../status/status.module';
import { Room } from '../chat/chatroom.entity';
import { Namespace } from 'socket.io';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { MockRepository } from 'src/mock/mock.repository';
import { ChatroomCreateRequestDto } from 'src/dto/request/chatroom.create.request.dto';
import { ChatroomService } from './chat.service';
import { UserService } from 'src/user/user.service';
import { Socket } from 'dgram';
import { Inject, Logger } from '@nestjs/common';
export const rooms = new Map<number, Room>();
let roomCount = 1;

type MessageType = 'message' | 'whisper' | 'systemMsg';
interface IMessage {
  fromId: number;
  content: string;
  type: MessageType;
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
  eventEmitter = new EventEmitter2();

  // private readonly userService: UserService;
  constructor(
    private readonly chatService: ChatroomService,
    //@Inject(UserService)
    private readonly userService: UserService,
  ) {}

  @WebSocketServer() server: Namespace;
  async handleConnection(socket) {
    this.logger.log(`Called ${this.handleConnection.name}`);
    // 연결 끊김 핸들러
    socket.on('disconnect', () => {
      // 끊긴 소켓 삭제
      users.forEach((value, key, map) => {
        if (socket.id == value.socketId) {
          if (value.location > 0) {
            for (let i = 0; i < rooms.get(value.location).users.length; i++) {
              if (rooms.get(value.location).users[i] == value.userId) {
                rooms.get(value.location).users.splice(i);
                break;
              }
            }
          }
          this.server.to('lobby').emit('deleteOnlineUser', key);
          users.delete(key);
          this.mock.deleteOnlineUser(key);
        }
      });
    });
  }
  //연결 끊김
  async handleDisconnect(client) {
    console.log('disconnect');
  }

  @SubscribeMessage('addUser')
  async onAddUser(client, info) {
    this.logger.log(`Called ${this.onAddUser.name}`);

    // 로비 채팅방 객체 생성
    if (rooms.size == 0) rooms.set(0, new Room(0, 'lobby'));

    // 유저 객체 생성 및 socketId 저장
    let user: User;
    if (users.has(info.userId)) {
      user = users.get(info.userId);
    } else {
      user = new User(info.userId, info.userName);
    }
    user.socketId = client.id;
    users.set(info.userId, user);

    // 로비 채팅방에 유저 추가
    client.join('lobby');
    this.mock.patchOnlineUser(info.userId);
    this.server.to('lobby').emit('addOnlineUser', {
      userId: info.userId,
      nickname: info.userName,
      avatarUrl: 'asdfd',
      email: 'sfds',
    });
  }

  @SubscribeMessage('message')
  async onMessage(client, msg) {
    const message: IMessage = {
      fromId: msg.userId,
      content: msg.msg,
      type: EMessageType.MESSAGE,
    };
    if (!msg.roomid) {
      this.server.to('lobby').emit('message', message);
    } else {
      this.server
        .to(rooms.get(msg.roomid).title)
        //.broadcast.emit('message', msg.msg);
        .emit('message', msg.msg);
    }
  }
  @SubscribeMessage('whisper')
  async onWhisper(client, msg) {
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
        console.log('whisper send');
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
  async joinChatRoom(roomId, userId) {
    const room = rooms.get(roomId);
    console.log('joinUser: ', await this.userService.getUserInfo(userId));
    const user = users.get(userId);
    // console.log('joinuser2: ', user);
    this.server.in(user.socketId).socketsLeave('lobby');
    this.server.in(user.socketId).socketsJoin(room.title);
    this.server
      .in(room.title)
      .emit('joinChatRoom', await this.userService.getUserInfo(userId));

    this.server
      .in(room.title)
      .emit('systemMsg', user.userName + '님이 입장하였습니다.');
    room.users.push(userId);
  }
  @OnEvent('chatroom:leave')
  leaveChatRoom(roomId, userId) {
    const room = rooms.get(roomId);
    const user = users.get(userId);
    if (room.masterUser === userId) {
      this.server.in(room.title).emit('destructChatRoom');
      this.server.in(room.title).socketsJoin('lobby');
      this.server.in(room.title).socketsLeave(room.title);
      this.server.in('lobby').emit('deleteChatRoom', roomId);
      rooms.delete(roomId);
    } else {
      this.server.in(user.socketId).socketsLeave(room.title);
      this.server.in(user.socketId).socketsJoin('lobby');
      this.server.in(room.title).emit('leaveChatRoom', userId);
      room.users.filter((id) => id !== userId);
    }
  }

  @OnEvent('chatroom:create')
  async addChatRoom(userId, roomInfo: ChatroomCreateRequestDto) {
    const roomId = roomCount++;
    rooms.set(
      roomId,
      new Room(
        roomId,
        roomInfo.title,
        roomInfo.mode,
        roomInfo.password,
        roomInfo.maxUserCount,
        userId,
      ),
    );
    console.log('create', roomId);
    this.server.in('lobby').emit('addChatRoom', rooms.get(roomId));
  }

  @OnEvent('chatroom:invite')
  async inviteChatRoom(roomId, fromId, toUsers) {
    const room = rooms.get(roomId);
    const to = new Array<User>();
    for (const id of toUsers) {
      to.push(users.get(id));
    }
    to.forEach((user) => {
      this.server.in(user.socketId).emit('inviteChatRoom', roomId, fromId);
      room.invitedUsers.push(user.userId);
    });
  }
  @OnEvent('chatroom:ban')
  async banChatRoom(roomId, userId) {
    const room = rooms.get(roomId);
    const user = users.get(userId);
    this.server.in(user.socketId).emit('banChatRoom', roomId);
    room.bannedUsers.push(userId);
    this.leaveChatRoom(roomId, userId);
  }
  @OnEvent('chatroom:promote-admin')
  async addAdmin(roomId, userId) {
    const room = rooms.get(roomId);
    const user = users.get(userId);
    room.adminUsers.push(userId);
    this.server.in(room.title).emit('addAdmin', userId);
  }
  @OnEvent('chatroom:demote-admin')
  async deleteAdmin(roomId, userId) {
    const room = rooms.get(roomId);
    const user = users.get(userId);
    room.adminUsers.filter((id) => id !== userId);
    this.server.in(room.title).emit('deleteAdmin', userId);
  }
  // @OnEvent('chatroom:mute-user')
  // async muteUser(roomId, userId, duration) {}
  // @OnEvent('chatroom:unmute-user')
  // async unmuteUser(roomId, userId, duration) {}

  // @OnEvent('chatroom:change-info')
  // async updateChatRoom(roomId, roomInfo) {}
}
