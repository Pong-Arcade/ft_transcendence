import { Inject, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import {
  ConnectedSocket,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Namespace, Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { GameRoom, Invitation } from './gameroom.entity';
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
import { GameInstance } from './gameInstance';
import {
  InGameEvent,
  InGameKeyEvent,
  InGamePlayer,
} from 'src/enum/ingame.event.enum';
import { GameRoomService } from './gameroom.service';
import { ChatroomService } from 'src/chat/chat.service';
import MatchHistory from 'src/entity/match.history.entity';
import { MatchHistoryDto } from 'src/dto/match.history.dto';
import { StatService } from 'src/stat/stat.service';

export const gameRooms = new Map<number, GameRoom>();
export let invitations: Invitation[] = [];

export const normalQuickMatchQueue = new Array<number>();
export const ladderQuickMatchQueue = new Array<number>();

@WebSocketGateway({
  namespace: 'socket/game',
})
export class GameGateway implements OnGatewayDisconnect {
  @WebSocketServer() server: Namespace;
  private logger = new Logger(GameGateway.name);
  //
  constructor(
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly eventEmitter: EventEmitter2,
    private readonly gameRoomService: GameRoomService,
    private readonly chatroomService: ChatroomService,
    private readonly statService: StatService,
    @Inject(ChatGateway) private readonly chatGateway: ChatGateway,
  ) {}

  handleConnection(socket) {
    this.logger.log(`Called ${this.handleConnection.name}`);
    //게임방 소켓 연결 직후 게임 스크린 정보 전달
    this.eventEmitter.emit('gameroom:config', socket);
  }

  handleDisconnect(socket) {
    this.logger.log(`Called ${this.handleDisconnect.name}`);
    // 끊긴 소켓 삭제
    const userSocketInfo = users.get(socket.id);
    if (userSocketInfo) {
      gameRooms.forEach((_, roomId) => {
        if (
          this.gameRoomService.isOnThatGameRoom(
            roomId + 1,
            userSocketInfo.userId,
          )
        ) {
          this.eventEmitter.emit(
            'gameroom:leave',
            roomId + 1,
            userSocketInfo.userId,
          );
        }
      });
      // 초대장을 가지고 있다면 삭제
      invitations = invitations.filter(
        (invitation) =>
          invitation.inviteeId !== userSocketInfo.userId &&
          invitation.inviterId !== userSocketInfo.userId,
      );
    }
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
      ...(await this.userService.getUserInfo(user.userId)),
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
    this.chatGateway.server.in(userSocketInfo.socketId).socketsLeave('lobby');

    this.server
      .in(userSocketInfo.gameSocketId)
      .socketsJoin(`gameroom-${roomId}`);

    const joinUser = await this.userService.getUserInfo(userSocketInfo.userId);
    this.server.in(`gameroom-${roomId}`).emit('joinGameRoom', joinUser);

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
      this.chatGateway.server
        .in('lobby')
        .emit('joinGameRoom', { joinUser, roomId });
    }
  }
  //
  @OnEvent('gameroom:leave')
  async leaveGame(roomId: number, userId: number) {
    this.logger.log(`Called ${this.leaveGame.name}`);
    // userId가 방장이면 redUser를 user에 저장하고, 그렇지 않으면 blueUser를 user에 저장함.
    const room = gameRooms.get(roomId);
    const user = room.redUser.userId === userId ? room.redUser : room.blueUser;
    const userSocketInfo = users.get(user.userId);
    //gameInstance 종료 이벤트
    await this.eventEmitter.emitAsync('gameroom:finish', roomId);
    if (user.userId === room.redUser.userId) {
      this.server.in(`gameroom-${room.roomId}`).emit('destructGameRoom');
      this.chatGateway.server
        .in(`gameroom-${room.roomId}`)
        .socketsJoin('lobby');
      this.server
        .in(`gameroom-${room.roomId}`)
        .socketsLeave(`gameroom-${room.roomId}`);
      this.chatGateway.server.in('lobby').emit('deleteGameRoom', roomId);
      gameRooms.delete(roomId);
    } else {
      this.server
        .in(userSocketInfo.gameSocketId)
        .socketsLeave(`gameroom-${room.roomId}`);
      this.chatGateway.server.in(userSocketInfo.socketId).socketsJoin('lobby');
      const userInfo = await this.userService.getUserInfo(userId);
      this.server.in(`gameroom-${room.roomId}`).emit('leaveGameRoom', userId);
      this.server
        .in(`gameroom-${roomId}`)
        .emit('systemMsg', userSocketInfo.userName + '님이 퇴장하였습니다.');

      room.blueUser = null;

      this.chatGateway.server
        .in('lobby')
        .emit('leaveGameRoom', { userInfo, roomId });
    }
  }

  @OnEvent('gameroom:invite')
  async inviteGame(userId: number, targetUserId: number, matchType: MatchType) {
    this.logger.log(`Called ${this.inviteGame.name}`);
    const userSocketInfo = users.get(userId);

    // 초대장을 생성
    invitations.push({
      invitationId: invitations.length + 1,
      inviterId: userId,
      inviteeId: targetUserId,
      matchType: matchType,
      expirationTime: new Date(new Date().getTime() + 1000 * 60),
    });

    // 초대장을 받은 유저에게 초대장을 전달
    // FIXME: 초대장에 어떤 내용을 담을지 협의 필요
    const inviteeSocketInfo = users.get(targetUserId);
    this.server
      .in(inviteeSocketInfo.gameSocketId)
      .emit('inviteGameRoom', await this.userService.getUserInfo(userId));

    // 1분 후 초대장이 남아있다면 초대장을 삭제
    setTimeout(() => {
      invitations = invitations.filter(
        (invitation) => invitation.invitationId !== invitations.length,
      );
    }, 1000 * 60);
  }

  @OnEvent('gameroom:invite:accept')
  async acceptInviteGame(userId: number) {
    this.logger.log(`Called ${this.acceptInviteGame.name}`);
    // 초대받은 사람의 socket 정보
    const inviteeSocketInfo = users.get(userId);

    // 초대장 정보
    const invitation = invitations.find(
      (invitation) => invitation.inviteeId === userId,
    );

    // 초대한 사람의 socket 정보
    const inviterId = invitation.inviterId;
    const inviterSocketInfo = users.get(inviterId);

    // 초대 게임방을 생성, 레드 유저를 먼저 넣어줍니다.
    const roomId = gameRooms.size + 1;
    const redUser: GameUserStatusDto = {
      ...(await this.userService.getUserInfo(inviterId)),
      status: GameRoomUserStatus.UN_READY,
    };
    const gameRoom = new GameRoom(
      roomId,
      redUser,
      GameRoomMode.NORMAL,
      invitation.matchType,
      10,
      'Quickplay Arena',
      5,
    );

    // 초대한 유저가 채팅방에 입장한 상태라면, 채팅방을 나간다.
    this.chatGateway.server
      .in(inviterSocketInfo.socketId)
      .socketsLeave(
        `chatroom${this.chatroomService.getMyChatroomInfo(inviterId)?.id}`,
      );

    // 초대보낸 유저가 게임방에 입장한다.
    this.server
      .in(inviterSocketInfo.gameSocketId)
      .socketsJoin(`gameroom-${roomId}`);

    // 블루 유저를 게임방에 넣어줍니다.
    gameRoom.blueUser = {
      ...(await this.userService.getUserInfo(inviterId)),
      status: GameRoomUserStatus.UN_READY,
    };

    // 초대받은 유저가 채팅방에 입장한 상태라면, 채팅방을 나간다.
    this.chatGateway.server
      .in(inviteeSocketInfo.socketId)
      .socketsLeave(
        `chatroom${
          this.chatroomService.getMyChatroomInfo(inviteeSocketInfo.userId)?.id
        }`,
      );

    // 초대받은 유저가 게임방에 입장한다.
    this.server
      .in(inviteeSocketInfo.gameSocketId)
      .socketsJoin(`gameroom-${roomId}`);

    // 게임이 매칭되었다는 메시지를 보냅니다.
    this.server.in(`gameroom-${roomId}`).emit('gameRoomMatched', gameRoom);

    // 초대장을 삭제
    invitations = invitations.filter(
      (invitation) => invitation.inviteeId !== userId,
    );

    // 게임방에 입장한 유저들에게 입장 메시지를 보냅니다.
    this.server
      .in(`gameroom-${roomId}`)
      .emit('systemMsg', '게임방에 입장하였습니다.');

    gameRooms.set(roomId, gameRoom);

    // 로비에 있는 유저들에게 게임방이 생성되었다는 메시지를 보냅니다.
    this.chatGateway.server.in('lobby').emit('addGameRoom', gameRoom);
  }

  @OnEvent('gameroom:invite:reject')
  async rejectInviteGame(userId: number) {
    this.logger.log(`Called ${this.rejectInviteGame.name}`);

    // 초대받은 사람의 socket 정보
    const inviteeSocketInfo = users.get(userId);

    const inviterId = invitations.find(
      (invitation) => invitation.inviteeId === userId,
    ).inviterId;
    // 초대한 사람의 socket 정보
    const inviterSocketInfo = users.get(inviterId);

    // inviteeId가 userId인 초대장을 삭제
    invitations = invitations.filter(
      (invitation) => invitation.inviteeId !== userId,
    );

    // 초대한 사람에게 초대 거절을 알림
    this.server.in(inviterSocketInfo.gameSocketId).emit('rejectInviteGameRoom');
  }

  @OnEvent('gameroom:spectator:join')
  async joinSpectator(roomId: number, userId: number) {
    this.logger.log(`Called ${this.joinSpectator.name}`);
    const userSocketInfo = users.get(userId);
    this.chatGateway.server.in(userSocketInfo.socketId).socketsLeave('lobby');
    this.server
      .in(userSocketInfo.gameSocketId)
      .socketsJoin(`gameroom-${roomId}`);

    this.server
      .in(`gameroom-${roomId}`)
      .emit('systemMsg', userSocketInfo.userName + '님이 입장 하였습니다.');

    const room = gameRooms.get(roomId);
    room.spectatorUsers.push(userId);
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
    this.chatGateway.server.in(userSocketInfo.socketId).socketsJoin('lobby');

    this.server
      .in(`gameroom-${roomId}`)
      .emit('systemMsg', userSocketInfo.userName + '님이 퇴장 하였습니다.');
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
    if (room.redUser?.userId === userId) {
      room.redUser.status = GameRoomUserStatus.READY;
      this.server
        .in(`gameroom-${roomId}`)
        .emit('readyRedUser', room.redUser.userId);
    }
    if (room.blueUser?.userId === userId) {
      room.blueUser.status = GameRoomUserStatus.READY;
      this.server
        .in(`gameroom-${roomId}`)
        .emit('readyBlueUser', room.blueUser.userId);
    }
    if (
      room.redUser?.status === GameRoomUserStatus.READY &&
      room.blueUser?.status === GameRoomUserStatus.READY
    ) {
      room.status = GameRoomStatus.ON_GAME;
      // 1초 간격으로 총 3번 이벤트를 발생시킵니다.
      let timeLimit = 3;
      const interval = setInterval(() => {
        this.server.in(`gameroom-${roomId}`).emit('readyTick', timeLimit);
        --timeLimit;
        if (timeLimit === 0) {
          clearInterval(interval);
          this.server.in(`gameroom-${roomId}`).emit('startGame');
          this.eventEmitter.emit('gameroom:start', roomId);
        }
      }, 1000);
    }
  }

  @OnEvent('gameroom:unready')
  async unreadyGame(roomId: number, userId: number) {
    this.logger.log(`Called ${this.unreadyGame.name}`);
    const room = gameRooms.get(roomId);
    if (room.redUser?.userId === userId) {
      room.redUser.status = GameRoomUserStatus.UN_READY;
      this.server
        .in(`gameroom-${roomId}`)
        .emit('unReadyRedUser', room.redUser.userId);
    }
    if (room.blueUser?.userId === userId) {
      room.blueUser.status = GameRoomUserStatus.UN_READY;
      this.server
        .in(`gameroom-${roomId}`)
        .emit('unReadyBlueUser', room.blueUser.userId);
    }
  }

  /**
   * 매칭이 성사되었을 때 호출되는 이벤트입니다.
   * 매칭이 성사되면 게임방을 생성하고, 매칭된 유저들을 게임방에 입장시킵니다.
   * @param redUserId
   * @param blueUserId
   * @param matchType
   * @returns
   */
  @OnEvent('game:matching')
  async matchingGameRoom(
    redUserId: number,
    blueUserId: number,
    matchType: MatchType,
  ) {
    this.logger.log(`Called ${this.matchingGameRoom.name}`);
    const redUserSocketInfo = users.get(redUserId);
    const blueUserSocketInfo = users.get(blueUserId);

    // 빠른 대전 게임방을 생성, 레드 유저를 먼저 넣어줍니다.
    const roomId = gameRooms.size + 1;
    const redUser: GameUserStatusDto = {
      ...(await this.userService.getUserInfo(redUserId)),
      status: GameRoomUserStatus.UN_READY,
    };
    const gameRoom = new GameRoom(
      roomId,
      redUser,
      GameRoomMode.NORMAL,
      matchType,
      10,
      'Quickplay Arena',
      5,
    );
    this.chatGateway.server
      .in(redUserSocketInfo.socketId)
      .socketsLeave('lobby');
    this.server
      .in(redUserSocketInfo.gameSocketId)
      .socketsJoin(`gameroom-${roomId}`);

    // 블루 유저를 게임방에 넣어줍니다.
    gameRoom.blueUser = {
      ...(await this.userService.getUserInfo(blueUserId)),
      status: GameRoomUserStatus.UN_READY,
    };
    this.chatGateway.server
      .in(blueUserSocketInfo.socketId)
      .socketsLeave('lobby');
    this.server
      .in(blueUserSocketInfo.gameSocketId)
      .socketsJoin(`gameroom-${roomId}`);

    // 게임이 매칭되었다는 메시지를 보냅니다.
    this.server.in(`gameroom-${roomId}`).emit('gameRoomMatched', gameRoom);

    // 게임방에 입장한 유저들에게 입장 메시지를 보냅니다.
    this.server
      .in(`gameroom-${roomId}`)
      .emit('systemMsg', '게임방에 입장하였습니다.');

    gameRooms.set(roomId, gameRoom);

    // 로비에 있는 유저들에게 게임방이 생성되었다는 메시지를 보냅니다.
    this.chatGateway.server.in('lobby').emit('addGameRoom', gameRoom);
  }

  @OnEvent('gameroom:start')
  async startGame(roomId: number) {
    const room = gameRooms.get(roomId);
    if (room.status === GameRoomStatus.ON_GAME) {
      return;
    }
    //gameInstance는 생성과 동시에 게임이 시작합니다.
    room.gameInstance = new GameInstance(
      roomId,
      room.winScore,
      room.mode,
      this.server,
      this.eventEmitter,
    );
  }

  @OnEvent('gameroom:finish')
  async onGameFinish(roomId: number) {
    this.logger.log(`Called ${this.onGameFinish.name}`);
    const room = gameRooms.get(roomId);
    if (room.status !== GameRoomStatus.ON_GAME) {
      return;
    }
    //전적 처리를 위한 게임 결과 정보 반환
    const gameResult = room.gameInstance.finishGame();
    room.gameInstance = null;
    room.status = GameRoomStatus.ON_READY;
    //게임 전적 처리
    const matchHistory: MatchHistoryDto = {
      redUserId: room.redUser.userId,
      blueUserId: room.blueUser.userId,
      redScore: gameResult.redScore,
      blueScore: gameResult.blueScore,
      beginDate: gameResult.beginDate,
      endDate: gameResult.endDate,
      matchType: room.type,
    };
    await this.statService.createMatchHistory(matchHistory);
  }

  @OnEvent('gameroom:config')
  pushConfig(client) {
    client.emit(InGameEvent.CONFIG, GameInstance.makeSetConfig());
  }

  @SubscribeMessage('keyDown')
  setKeyDownEvent(client, roomId, userId, keyCode) {
    const room = gameRooms.get(roomId);
    if (
      room === undefined &&
      !(room.redUser.userId === userId || room.blueUser.userId === userId)
    ) {
      return;
    }
    if (room.status !== GameRoomStatus.ON_GAME) {
      return;
    }
    const user =
      room.redUser.userId === userId ? InGamePlayer.RED : InGamePlayer.BLUE;
    if (keyCode === 38) {
      room.gameInstance.setPaddleDirection(user, InGameKeyEvent.ARROW_UP);
    } else if (keyCode === 40) {
      room.gameInstance.setPaddleDirection(user, InGameKeyEvent.ARROW_DOWN);
    }
  }

  @SubscribeMessage('keyUp')
  setKeyUpEvent(client, roomId, userId) {
    const room = gameRooms.get(roomId);
    if (
      room === undefined &&
      !(room.redUser.userId === userId || room.blueUser.userId === userId)
    ) {
      return;
    }
    if (room.status !== GameRoomStatus.ON_GAME) {
      return;
    }
    const user: InGamePlayer =
      room.redUser.userId === userId ? InGamePlayer.RED : InGamePlayer.BLUE;
    room.gameInstance.setPaddleDirection(user, InGameKeyEvent.STOP);
  }
}
//
