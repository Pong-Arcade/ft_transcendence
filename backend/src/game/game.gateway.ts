import { Inject, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Namespace, Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { GameRoom } from './gameroom.entity';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { GameRoomCreateRequestDto } from 'src/dto/request/gameroom.create.request.dto';
import { users } from 'src/status/status.module';
import { UserService } from 'src/user/user.service';
import { UserDto } from 'src/dto/user.dto';
import { GameUserStatusDto } from 'src/dto/game.user.status.dto';
import { GameRoomUserStatus } from 'src/enum/gameroom.user.status.enum';
import { GameRoomStatus } from 'src/enum/gameroom.status.enum';
import { GameRoomMode } from 'src/enum/gameroom.mode.enum';
import { MatchType } from 'src/enum/match.type.enum';
import { User } from 'src/status/status.entity';
import { ChatGateway } from 'src/chat/chat.geteway';

export const gameRooms = new Map<number, GameRoom>();
@WebSocketGateway({
  namespace: 'socket/game',
})
export class GameGateway implements OnGatewayDisconnect {
  @WebSocketServer() server: Namespace;
  private logger = new Logger(GameGateway.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly eventEmitter: EventEmitter2,
    @Inject(ChatGateway) private readonly chatGateway: ChatGateway,
  ) {}

  handleDisconnect(@ConnectedSocket() socket: Socket) {
    this.logger.log(`Called ${this.handleDisconnect.name}`);
    this.logger.log(`Client disconnected: ${socket.id}`);
  }

  @SubscribeMessage('addUser')
  async onAddUser(client, info) {
    this.logger.log(`Called ${this.onAddUser.name}`);

    // 유저 객체 생성 및 gameSocketId 저장
    let user: User;
    if (users.has(info.userId)) {
      user = users.get(info.userId);
    } else {
      user = new User(info.userId, info.userName);
    }
    user.gameSocketId = client.id;
    users.set(info.userId, user);
  }

  /**
   * 게임방을 생성합니다.
   * 게임방 객체를 생성하고, 로비에 있는 유저들에게 게임방 리스트를 추가하라는 이벤트를 발생시킵니다.
   * @param user
   * @param gameRoomCreateRequestDto
   */
  @OnEvent('gameroom:create')
  async addGameRoom(
    user: UserDto,
    gameRoomCreateRequestDto: GameRoomCreateRequestDto,
  ) {
    this.logger.log(`Called ${this.addGameRoom.name}`);
    const roomId = gameRooms.size + 1;
    const redUser: GameUserStatusDto = {
      userId: user.userId,
      nickname: user.nickname,
      status: GameRoomUserStatus.UN_READY,
    };
    const gameRoom = new GameRoom(
      roomId,
      redUser,
      gameRoomCreateRequestDto.mode,
      gameRoomCreateRequestDto.type,
      gameRoomCreateRequestDto.winScore,
      gameRoomCreateRequestDto.title,
      gameRoomCreateRequestDto.maxSpectatorCount,
    );
    gameRooms.set(roomId, gameRoom);
    // FIXME: chat gameway의 socket server에 접근하는 방법을 찾아야 함.
    this.chatGateway.server.in('lobby').emit('addGameRoom', gameRoom);
  }

  /**
   * 게임방에 입장합니다.
   * 게임방에 입장한 유저의 정보를 게임방에 있는 유저들에게 전달하고, 입장 메시지를 전달합니다.
   */
  @OnEvent('gameroom:join')
  async joinGame(roomId: number, user: UserDto) {
    this.logger.log(`Called ${this.joinGame.name}`);
    const userSocketInfo = users.get(user.userId);
    // FIXME: chat gameway의 socket server에 접근하는 방법을 찾아야 함.
    console.log(userSocketInfo);
    this.chatGateway.server.in(userSocketInfo.socketId).socketsLeave('lobby');

    this.server
      .in(userSocketInfo.gameSocketId)
      .socketsJoin(`gameroom-${roomId}`);

    this.server
      .in(`gameroom-${roomId}`)
      .emit(
        'joinGameRoom',
        await this.userService.getUserInfo(userSocketInfo.userId),
      );

    this.server
      .in(`gameroom-${roomId}`)
      .emit('systemMsg', userSocketInfo.userName + '님이 입장하였습니다.');

    const room = gameRooms.get(roomId);
    if (room.redUser && room.redUser.userId != user.userId) {
      room.blueUser = {
        userId: user.userId,
        nickname: user.nickname,
        status: GameRoomUserStatus.UN_READY,
      };
    }
    room.invitedUsers = room.invitedUsers.filter((id) => id !== user.userId);
  }

  @OnEvent('gameroom:leave')
  async leaveGame(roomId: number, userId: number) {
    this.logger.log(`Called ${this.leaveGame.name}`);
    // userId가 방장이면 redUser를 user에 저장하고, 그렇지 않으면 blueUser를 user에 저장함.
    const room = gameRooms.get(roomId);
    const user = room.redUser.userId === userId ? room.redUser : room.blueUser;
    const userSocketInfo = users.get(user.userId);
    if (user.userId === room.redUser.userId) {
      this.server.in(`gameroom-${room.roomId}`).emit('destructGameRoom');
      // FIXME: chat gameway의 socket server에 접근하는 방법을 찾아야 함.
      this.chatGateway.server
        .in(`gameroom-${room.roomId}`)
        .socketsJoin('lobby');
      this.server
        .in(`gameroom-${room.roomId}`)
        .socketsLeave(`gameroom-${room.roomId}`);
      // FIXME: chat gameway의 socket server에 접근하는 방법을 찾아야 함.
      this.chatGateway.server.in('lobby').emit('deleteGameRoom', roomId);
      gameRooms.delete(roomId);
    } else {
      this.server
        .in(userSocketInfo.gameSocketId)
        .socketsLeave(`gameroom-${room.roomId}`);
      // FIXME: chat gameway의 socket server에 접근하는 방법을 찾아야 함.
      this.chatGateway.server.in(userSocketInfo.socketId).socketsJoin('lobby');
      this.server.in(`gameroom-${room.roomId}`).emit('leaveGameRoom', userId);
    }
  }

  @OnEvent('gameroom:invite')
  async inviteGame(roomId: number, userId: number, targetUserIds: number[]) {
    this.logger.log(`Called ${this.inviteGame.name}`);
    const room = gameRooms.get(roomId);
    const userSocketInfo = users.get(userId);
    for (const targetUserId of targetUserIds) {
      room.invitedUsers.push(targetUserId);
      const targetUserSocketInfo = users.get(targetUserId);
      this.server
        .in(targetUserSocketInfo.gameSocketId)
        .emit('inviteGameRoom', roomId);
    }
    // 채팅방을 생성 후, 그 방으로 입장
    await this.eventEmitter.emitAsync(
      'gameroom:create',
      {
        userId,
        nickname: userSocketInfo.userName,
      } as UserDto,
      {
        mode: GameRoomMode.NORMAL,
        type: MatchType.NORMAL,
        winScore: 10,
        title: 'Quickplay Arena',
        maxSpectatorCount: 5,
      } as GameRoomCreateRequestDto,
    );
    this.eventEmitter.emit('gameroom:join', roomId, {
      userId,
      nickname: userSocketInfo.userName,
    } as UserDto);
  }

  @OnEvent('gameroom:invite:reject')
  async rejectInviteGame(roomId: number, userId: number) {
    this.logger.log(`Called ${this.rejectInviteGame.name}`);
  }

  @OnEvent('gameroom:spectator:join')
  async joinSpectator(roomId: number, userId: number) {
    this.logger.log(`Called ${this.joinSpectator.name}`);
    const userSocketInfo = users.get(userId);
    // FIXME: chat gameway의 socket server에 접근하는 방법을 찾아야 함.
    this.chatGateway.server.in(userSocketInfo.socketId).socketsLeave('lobby');
    this.server
      .in(userSocketInfo.gameSocketId)
      .socketsJoin(`gameroom-${roomId}`);
    this.server
      .in(`gameroom-${roomId}`)
      .emit(
        'joinGameRoom',
        await this.userService.getUserInfo(userSocketInfo.userId),
      );

    this.server
      .in(`gameroom-${roomId}`)
      .emit('systemMsg', userSocketInfo.userName + '님이 입장하였습니다.');

    const room = gameRooms.get(roomId);
    room.spectatorUsers.push(userId);
    room.invitedUsers = room.invitedUsers.filter((id) => id !== userId);
  }

  @OnEvent('gameroom:spectator:leave')
  async leaveSpectator(roomId: number, userId: number) {
    this.logger.log(`Called ${this.leaveSpectator.name}`);
    const room = gameRooms.get(roomId);
    room.spectatorUsers = room.spectatorUsers.filter((id) => id !== userId);
    const userSocketInfo = users.get(userId);
    this.server
      .in(userSocketInfo.gameSocketId)
      .socketsLeave(`gameroom-${room.roomId}`);
    // FIXME: chat gameway의 socket server에 접근하는 방법을 찾아야 함.
    this.chatGateway.server.in(userSocketInfo.socketId).socketsJoin('lobby');
    this.server.in(`gameroom-${room.roomId}`).emit('leaveGameRoom', userId);
  }

  /**
   * 게임방의 유저가 게임을 준비합니다.
   * 두 유저가 모두 준비가 되면 startGame 이벤트를 발생시킵니다.
   * @param roomId
   * @param userId
   */
  @OnEvent('gameroom:ready')
  async readyGame(roomId: number, userId: number) {
    this.logger.log(`Called ${this.readyGame.name}`);
    const room = gameRooms.get(roomId);
    if (room.redUser.userId === userId) {
      room.redUser.status = GameRoomUserStatus.READY;
    } else {
      room.blueUser.status = GameRoomUserStatus.READY;
    }
    if (
      room.redUser.status === GameRoomUserStatus.READY &&
      room.blueUser.status === GameRoomUserStatus.READY
    ) {
      room.status = GameRoomStatus.ON_GAME;
      this.server.in(`gameroom-${roomId}`).emit('startGame');
    }
  }

  @OnEvent('gameroom:unready')
  async unreadyGame(roomId: number, userId: number) {
    this.logger.log(`Called ${this.unreadyGame.name}`);
    const room = gameRooms.get(roomId);
    if (room.redUser.userId === userId) {
      room.redUser.status = GameRoomUserStatus.UN_READY;
    } else {
      room.blueUser.status = GameRoomUserStatus.UN_READY;
    }
  }
}
