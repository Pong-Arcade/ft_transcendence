import { Logger } from '@nestjs/common';
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
import { OnEvent } from '@nestjs/event-emitter';
import { GameRoomCreateRequestDto } from 'src/dto/request/gameroom.create.request.dto';
import { users } from 'src/status/status.module';
import { UserService } from 'src/user/user.service';

export const gameRooms = new Map<number, GameRoom>();
@WebSocketGateway({
  namespace: 'game',
})
export class GameGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Namespace;
  private logger = new Logger(GameGateway.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {}

  afterInit(server: Namespace) {
    // this.server.adapter.on('delete-room', (room) => {
    //   const deletedRoom = gameRooms.find((roomName) => roomName === room);
    //   if (!deletedRoom) {
    //     return;
    //   }
    //   this.server.emit('delete-room', deletedRoom);
    //   gameRooms = gameRooms.filter((roomName) => roomName !== deletedRoom);
    //   this.logger.log(`room ${room} deleted`);
    // });
    this.logger.log('Initialized');
  }

  async handleConnection(@ConnectedSocket() socket: Socket) {
    /*
    const token = socket.handshake.headers[
      `${this.configService.get<string>('jwt.token')}`
    ] as string;
    try {
      const payload = this.jwtService.verify(token);
      const user = await this.authService.checkUserExists(payload.userId);
      if (!user) {
        throw new Error("User doesn't exist");
      }
    } catch (error) {
      socket.disconnect();
      return;
    }
    this.logger.log(`Client connected: ${socket.id}`);
  */
  }
  //*/

  handleDisconnect(@ConnectedSocket() socket: Socket) {
    this.logger.log(`Client disconnected: ${socket.id}`);
  }

  @SubscribeMessage('chat')
  handleMessage(
    @ConnectedSocket() socket: Socket,
    @MessageBody() { roomName, message },
  ) {
    this.logger.log(`message from ${socket.id}: ${message}`);
    socket.broadcast
      .to(roomName)
      .emit('chat', { username: socket.id, message });
    return { username: socket.id, message };
  }

  @SubscribeMessage('room-list')
  handleRoomList() {
    console.log(gameRooms);
    this.logger.log(`room list requested`);
    this.server.emit('room-list', gameRooms);
    return gameRooms;
  }

  // @SubscribeMessage('create-room')
  // handleCreateRoom(
  //   @ConnectedSocket() socket: Socket,
  //   @MessageBody() roomName: string,
  // ) {
  //   const room = gameRooms.find((roomName) => roomName === roomName);
  //   if (room) {
  //     return { success: false, payload: '이미 존재하는 방입니다.' };
  //   }
  //   socket.join(roomName); // 기존에 없는 방에 Join하면 새로 생성된다.
  //   this.logger.log(`room ${roomName} created`);
  //   gameRooms.push(roomName);
  //   this.server.emit('create-room', roomName);
  //   return { success: true, payload: roomName };
  // }

  // @SubscribeMessage('join-room')
  // handleJoinRoom(
  //   @ConnectedSocket() socket: Socket,
  //   @MessageBody() roomName: string,
  // ) {
  //   const room = gameRooms.find((roomName) => roomName === roomName);
  //   if (!room) {
  //     return { success: false, payload: '존재하지 않는 방입니다.' };
  //   }
  //   socket.join(roomName);
  //   this.logger.log(`${socket.id} joined ${roomName}`);
  //   socket.broadcast
  //     .to(roomName)
  //     .emit('chat', `${socket.id} 님이 입장하셨습니다.`);
  //   return { success: true, payload: roomName };
  // }

  // @SubscribeMessage('leave-room')
  // handleLeaveRoom(
  //   @ConnectedSocket() socket: Socket,
  //   @MessageBody() roomName: string,
  // ) {
  //   const room = gameRooms.get((roomName) => roomName === roomName);
  //   if (!room) {
  //     return { success: false, payload: '존재하지 않는 방입니다.' };
  //   }
  //   socket.broadcast
  //     .to(roomName)
  //     .emit('chat', `${socket.id} 님이 퇴장하셨습니다.`);
  //   socket.leave(roomName);
  //   this.logger.log(`${socket.id} left ${roomName}`);
  //   return { success: true, payload: roomName };
  // }

  /**
   * 게임방을 생성합니다.
   * 게임방 객체를 생성하고, 로비에 있는 유저들에게 게임방 리스트를 추가하라는 이벤트를 발생시킵니다.
   * @param userId
   * @param gameRoomCreateRequestDto
   */
  @OnEvent('gameroom:create')
  async addGameRoom(
    userId: number,
    gameRoomCreateRequestDto: GameRoomCreateRequestDto,
  ) {
    this.logger.log(`Called ${this.addGameRoom.name}`);
    const roomId = gameRooms.size + 1;
    const gameRoom = new GameRoom(
      roomId,
      userId,
      gameRoomCreateRequestDto.mode,
      gameRoomCreateRequestDto.type,
      gameRoomCreateRequestDto.winScore,
      gameRoomCreateRequestDto.title,
      gameRoomCreateRequestDto.maxSpectatorCount,
    );
    gameRooms.set(roomId, gameRoom);
    this.server.in('lobby').emit('addGameRoom', gameRoom);
  }

  /**
   * 게임방에 입장합니다.
   * 게임방에 입장한 유저의 정보를 게임방에 있는 유저들에게 전달하고, 입장 메시지를 전달합니다.
   */
  @OnEvent('gameroom:join')
  async joinGame(roomId: number, userId: number) {
    const user = users.get(userId);

    this.server.in(user.socketId).socketsLeave('lobby');
    this.server.in(user.socketId).socketsJoin(`gameroom-${roomId}`);
    this.server
      .in(`gameroom-${roomId}`)
      .emit('joinGameRoom', await this.userService.getUserInfo(userId));

    this.server
      .in(`gameroom-${roomId}`)
      .emit('systemMsg', user.userName + '님이 입장하였습니다.');
  }

  @OnEvent('gameroom:leave')
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async leaveGame(roomId: number, userId: number) {}

  @OnEvent('gameroom:invite')
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async inviteGame(roomId: number, userId: number) {}

  @OnEvent('gameroom:invite:reject')
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async rejectInviteGame(roomId: number, userId: number) {}

  @OnEvent('gameroom:spectator:join')
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async joinSpectator(roomId: number, userId: number) {}

  @OnEvent('gameroom:spectator:leave')
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async leaveSpectator(roomId: number, userId: number) {}

  @OnEvent('gameroom:ready')
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async readyGame(roomId: number, userId: number) {}

  @OnEvent('gameroom:unready')
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async unreadyGame(roomId: number, userId: number) {}
}
