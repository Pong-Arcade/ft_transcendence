import { Inject, Logger, UnauthorizedException } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Namespace, Socket } from 'socket.io';
import { GameRoom } from './gameroom.entity';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { GameRoomCreateRequestDto } from 'src/dto/request/gameroom.create.request.dto';
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
import { MatchHistoryDto } from 'src/dto/match.history.dto';
import { StatService } from 'src/stat/stat.service';
import { StatusService } from 'src/status/status.service';
import { JwtService } from '@nestjs/jwt';

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
  namespace: 'socket/game',
})
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Namespace;
  private logger = new Logger(GameGateway.name);
  //
  constructor(
    private readonly userService: UserService,
    private readonly eventEmitter: EventEmitter2,
    private readonly gameRoomService: GameRoomService,
    private readonly chatroomService: ChatroomService,
    private readonly statService: StatService,
    @Inject('StatusService')
    private readonly statusService: StatusService,
    private readonly jwtService: JwtService,
    @Inject(ChatGateway) private readonly chatGateway: ChatGateway,
  ) {}

  handleConnection(socket: Socket) {
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
  }

  handleDisconnect(socket) {
    this.logger.log(`Called ${this.handleDisconnect.name}`);
    // 끊긴 소켓 삭제
    const userSocketInfo = this.statusService.getUserSocketInfoBySocketId(
      socket.id,
    );
    if (userSocketInfo) {
      this.gameRoomService.disconnectUser(userSocketInfo);
    }
  }

  @SubscribeMessage('addUser')
  async onAddUser(client, info) {
    this.logger.log(`Called ${this.onAddUser.name}`);

    // 유저 객체 생성 및 gameSocketId 저장
    let user: User;
    user = this.statusService.getUserSocketInfoByUserId(info.userId);
    if (!user) {
      user = new User(info.userId, info.userName);
    }
    user.gameSocketId = client.id;
    this.statusService.setUserSocketInfo(info.userId, user);
  }

  @SubscribeMessage('message')
  async onMessage(_, msg) {
    const userSocketInfo = this.statusService.getUserSocketInfoByUserId(
      msg.userId,
    );
    if (!userSocketInfo) {
      return;
    }

    if (userSocketInfo.location >= 0) {
      return;
    }
    const room = this.gameRoomService.getGameRoomInfo(
      Math.abs(userSocketInfo.location),
    );
    const message: IMessage = {
      fromId: msg.userId,
      content: msg.msg,
      type: EMessageType.MESSAGE,
      roomId: room.roomId,
    };

    if (msg.msg.split(':')[1].length > 64) {
      message.content = '64자 이상으로 입력할 수 없습니다.';
      message.type = EMessageType.SYSTEMMSG;
      this.server.in(userSocketInfo.gameSocketId).emit('systemMsg', message);
      return;
    }

    this.server.to(`gameroom-${room.roomId}`).emit('message', message);
  }

  @SubscribeMessage('whisper')
  async onWhisper(client, msg) {
    if (msg.fromName == msg.toName) {
      return;
    }
    const userSocketInfo = this.statusService.getUserSocketInfoByUserId(
      msg.fromId,
    );
    if (!userSocketInfo) {
      return;
    }
    if (msg.msg.length > 64) {
      const message: IMessage = {
        fromId: msg.fromId,
        content: '64자 이상으로 입력할 수 없습니다.',
        type: EMessageType.SYSTEMMSG,
      };
      this.server.in(userSocketInfo.gameSocketId).emit('systemMsg', message);
      return;
    }
    const users = this.statusService.getAllUserSocketInof();
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

        this.chatGateway.server
          .to(userSocketInfo.socketId)
          .emit('whisper', toWhisperMsg);
        this.chatGateway.server
          .to(value.socketId)
          .emit('whisper', fromWhisperMsg);
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
    const roomId = this.gameRoomService.getGameRoomCount() + 1;
    const redUser: GameUserStatusDto = {
      ...(await this.userService.getUserInfo(user.userId)),
      gameUserStatus: GameRoomUserStatus.UN_READY,
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
    this.gameRoomService.createGameRoom(roomId, gameRoom);
    this.chatGateway.server.in('lobby').emit('addGameRoom', gameRoom);
  }
  /**
   * 게임방에 입장합니다.
   * 게임방에 입장한 유저의 정보를 게임방에 있는 유저들에게 전달하고, 입장 메시지를 전달합니다.
   */
  @OnEvent('gameroom:join')
  async joinGame(roomId: number, user: UserDto) {
    this.logger.log(`Called ${this.joinGame.name}`);
    const userSocketInfo = this.statusService.getUserSocketInfoByUserId(
      user.userId,
    );
    if (!userSocketInfo) return;
    userSocketInfo.location = -roomId;
    this.chatGateway.server.in(userSocketInfo.socketId).socketsLeave('lobby');

    this.server
      .in(userSocketInfo.gameSocketId)
      .socketsJoin(`gameroom-${roomId}`);

    const joinUser = await this.userService.getUserInfo(userSocketInfo.userId);
    this.server.in(`gameroom-${roomId}`).emit('joinGameRoom', joinUser);

    const message: IMessage = {
      fromId: userSocketInfo.userId,
      content: userSocketInfo.userName + '님이 입장하였습니다.',
      type: EMessageType.SYSTEMMSG,
    };
    this.server.in(`gameroom-${roomId}`).emit('systemMsg', message);

    const room = this.gameRoomService.getGameRoomInfo(roomId);

    if (room.redUser && room.redUser.userId != user.userId) {
      room.blueUser = {
        userId: user.userId,
        nickname: user.nickname,
        gameUserStatus: GameRoomUserStatus.UN_READY,
      };
      this.chatGateway.server
        .in('lobby')
        .emit('joinGameRoom', { joinUser, roomId });
    }
  }

  @OnEvent('gameroom:leave')
  async leaveGame(roomId: number, userId: number) {
    this.logger.log(`Called ${this.leaveGame.name}`);
    // userId가 방장이면 redUser를 user에 저장하고, 그렇지 않으면 blueUser를 user에 저장함.
    const room = this.gameRoomService.getGameRoomInfo(roomId);
    const user = room.redUser.userId === userId ? room.redUser : room.blueUser;
    const userSocketInfo = this.statusService.getUserSocketInfoByUserId(
      user.userId,
    );
    if (!userSocketInfo) {
      return;
    }

    //gameInstance 종료 이벤트
    if (room.status === GameRoomStatus.ON_GAME) {
      await this.eventEmitter.emitAsync('gameroom:finish', roomId, userId);
    }
    if (user.userId === room.redUser.userId) {
      this.server.in(`gameroom-${room.roomId}`).emit('destructGameRoom');
      for (const user of this.gameRoomService.getAllGameRoomUsers(roomId)) {
        if (!user) continue;
        this.server
          .in(user.gameSocketId)
          .socketsLeave(`gameroom-${room.roomId}`);
        this.chatGateway.server.in(user.socketId).socketsJoin('lobby');
        user.location = 0;
      }

      this.server
        .in(`gameroom-${room.roomId}`)
        .socketsLeave(`gameroom-${room.roomId}`);
      this.chatGateway.server.in('lobby').emit('deleteGameRoom', roomId);
      this.gameRoomService.deleteGameRoom(roomId);
    } else {
      this.server
        .in(userSocketInfo.gameSocketId)
        .socketsLeave(`gameroom-${room.roomId}`);
      this.chatGateway.server.in(userSocketInfo.socketId).socketsJoin('lobby');
      const userInfo = await this.userService.getUserInfo(userId);
      userSocketInfo.location = 0;
      this.server.in(`gameroom-${room.roomId}`).emit('leaveGameRoom', userId);

      const message: IMessage = {
        fromId: userSocketInfo.userId,
        content: userSocketInfo.userName + '님이 퇴장하였습니다.',
        type: EMessageType.SYSTEMMSG,
      };
      this.server.in(`gameroom-${roomId}`).emit('systemMsg', message);

      room.blueUser = null;

      this.chatGateway.server
        .in('lobby')
        .emit('leaveGameRoom', { userInfo, roomId });
    }
  }

  @OnEvent('gameroom:invite')
  async inviteGame(userId: number, targetUserId: number, matchType: MatchType) {
    this.logger.log(`Called ${this.inviteGame.name}`);

    // 초대장을 생성
    const invitation = this.gameRoomService.createInvitation(
      userId,
      targetUserId,
      matchType,
    );

    // 초대장을 받은 유저에게 초대장을 전달
    const inviteeUserDetail = await this.userService.getUserDetail(userId);
    const inviteeSocketInfo =
      this.statusService.getUserSocketInfoByUserId(targetUserId);
    this.server
      .in(inviteeSocketInfo.gameSocketId)
      .emit('inviteGameRoom', inviteeUserDetail);

    // 10초 후 초대장이 남아있다면 초대장을 삭제
    setTimeout(() => {
      if (
        this.gameRoomService.findInvitationByInviteeId(inviteeSocketInfo.userId)
      ) {
        this.gameRoomService.deleteInvitationById(invitation);
        const inviterSocketInfo =
          this.statusService.getUserSocketInfoByUserId(userId);

        // 초대한 사람에게 시간초과 알림
        this.server
          .in(inviterSocketInfo.gameSocketId)
          .emit('rejectInviteGameRoom');

        // 초대받은 사람에게 시간초과 알림
        this.server
          .in(inviteeSocketInfo.gameSocketId)
          .emit('timeoutInviteGameRoom');
      }
    }, 1000 * 10);
  }

  @OnEvent('gameroom:invite:accept')
  async acceptInviteGame(userId: number) {
    this.logger.log(`Called ${this.acceptInviteGame.name}`);
    // 초대받은 사람의 socket 정보
    const inviteeSocketInfo =
      this.statusService.getUserSocketInfoByUserId(userId);

    // 초대장 정보
    const invitation = this.gameRoomService.findInvitationByInviteeId(userId);

    // 초대한 사람의 socket 정보
    const inviterId = invitation.inviterId;

    // 초대 게임방을 생성, 레드 유저를 먼저 넣어줍니다.
    const roomId = this.gameRoomService.getGameRoomCount() + 1;
    const redUser: GameUserStatusDto = {
      ...(await this.userService.getUserInfo(inviterId)),
      gameUserStatus: GameRoomUserStatus.UN_READY,
    };

    // 초대한 유저가 채팅방에 입장한 상태라면, 채팅방을 나간다.
    this.eventEmitter.emit(
      'chatroom:leave',
      this.chatroomService.getMyChatroomInfo(inviterId)?.roomId,
      inviterId,
    );

    // 게임방 생성
    await this.eventEmitter.emitAsync('gameroom:create', redUser, {
      mode: GameRoomMode.NORMAL,
      type: invitation.matchType,
      winScore: 10,
      title: 'Quickplay Arena',
      maxSpectatorCount: 5,
    } as GameRoomCreateRequestDto);
    // 초대보낸 유저가 게임방에 입장한다.
    this.eventEmitter.emit('gameroom:join', roomId, redUser);

    const gameRoom = this.gameRoomService.getGameRoomInfo(roomId);

    // 블루 유저를 게임방에 넣어줍니다.
    gameRoom.blueUser = {
      ...(await this.userService.getUserInfo(inviteeSocketInfo.userId)),
      gameUserStatus: GameRoomUserStatus.UN_READY,
    };

    // 초대받은 유저가 채팅방에 입장한 상태라면, 채팅방을 나간다.
    this.eventEmitter.emit(
      'chatroom:leave',
      this.chatroomService.getMyChatroomInfo(inviteeSocketInfo.userId)?.roomId,
      inviteeSocketInfo.userId,
    );

    // 초대받은 유저가 게임방에 입장한다.
    this.eventEmitter.emit('gameroom:join', roomId, gameRoom.blueUser);

    // 게임이 매칭되었다는 메시지를 보냅니다.
    this.server.in(`gameroom-${roomId}`).emit('gameRoomMatched', gameRoom);

    // 초대장을 삭제
    this.gameRoomService.deleteInvitaionByInviteeId(userId);

    this.gameRoomService.createGameRoom(roomId, gameRoom);
  }

  @OnEvent('gameroom:invite:reject')
  async rejectInviteGame(userId: number) {
    this.logger.log(`Called ${this.rejectInviteGame.name}`);

    const inviterId =
      this.gameRoomService.findInvitationByInviteeId(userId).inviterId;
    // 초대한 사람의 socket 정보
    const inviterSocketInfo =
      this.statusService.getUserSocketInfoByUserId(inviterId);

    // inviteeId가 userId인 초대장을 삭제
    this.gameRoomService.deleteInvitaionByInviteeId(userId);

    // 초대한 사람에게 초대 거절을 알림
    this.server.in(inviterSocketInfo.gameSocketId).emit('rejectInviteGameRoom');
  }

  @OnEvent('gameroom:spectator:join')
  async joinSpectator(roomId: number, userId: number) {
    this.logger.log(`Called ${this.joinSpectator.name}`);
    const userSocketInfo = this.statusService.getUserSocketInfoByUserId(userId);
    if (!userSocketInfo) return;
    userSocketInfo.location = -roomId;
    this.chatGateway.server.in(userSocketInfo.socketId).socketsLeave('lobby');
    this.server
      .in(userSocketInfo.gameSocketId)
      .socketsJoin(`gameroom-${roomId}`);

    const message: IMessage = {
      fromId: userSocketInfo.userId,
      content: userSocketInfo.userName + '님이 관전 입장하였습니다.',
      type: EMessageType.SYSTEMMSG,
    };
    this.server.in(`gameroom-${roomId}`).emit('systemMsg', message);

    const room = this.gameRoomService.getGameRoomInfo(roomId);
    room.spectatorUsers.push(userId);
  }

  @OnEvent('gameroom:spectator:leave')
  async leaveSpectator(roomId: number, userId: number) {
    this.logger.log(`Called ${this.leaveSpectator.name}`);
    const room = this.gameRoomService.getGameRoomInfo(roomId);
    room.spectatorUsers = room.spectatorUsers.filter((id) => id !== userId);
    const userSocketInfo = this.statusService.getUserSocketInfoByUserId(userId);
    userSocketInfo.location = 0;
    this.server
      .in(userSocketInfo.gameSocketId)
      .socketsLeave(`gameroom-${room.roomId}`);
    this.chatGateway.server.in(userSocketInfo.socketId).socketsJoin('lobby');

    const message: IMessage = {
      fromId: userSocketInfo.userId,
      content: userSocketInfo.userName + '님이 관전 종료했습니다.',
      type: EMessageType.SYSTEMMSG,
    };
    this.server.in(`gameroom-${roomId}`).emit('systemMsg', message);
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
    const room = this.gameRoomService.getGameRoomInfo(roomId);
    if (room.redUser?.userId === userId) {
      room.redUser.gameUserStatus = GameRoomUserStatus.READY;
      this.server
        .in(`gameroom-${roomId}`)
        .emit('readyRedUser', room.redUser.userId);
    }
    if (room.blueUser?.userId === userId) {
      room.blueUser.gameUserStatus = GameRoomUserStatus.READY;
      this.server
        .in(`gameroom-${roomId}`)
        .emit('readyBlueUser', room.blueUser.userId);
    }
    if (
      room.redUser?.gameUserStatus === GameRoomUserStatus.READY &&
      room.blueUser?.gameUserStatus === GameRoomUserStatus.READY
    ) {
      // 1초 간격으로 총 3번 이벤트를 발생시킵니다.
      let timeLimit = 3;
      room.status = GameRoomStatus.ON_COUNT_DOWN;
      const interval = setInterval(() => {
        if (timeLimit === 0) {
          this.server.in(`gameroom-${roomId}`).emit('startGame');
          clearInterval(interval);
          if (this.gameRoomService.getGameRoomUserCount(roomId) != 2) {
            this.server.in(`gameroom-${roomId}`).emit('readyTick', timeLimit);
            if (room?.redUser) {
              this.eventEmitter.emit(
                'gameroom:unready',
                roomId,
                room.redUser?.userId,
              );
            }
            this.server.in(`gameroom-${roomId}`).emit('finish', timeLimit);
            return;
          }
          this.eventEmitter.emit('gameroom:start', roomId);
          room.status = GameRoomStatus.ON_GAME;
        }
        this.server.in(`gameroom-${roomId}`).emit('readyTick', timeLimit);
        --timeLimit;
      }, 1000);
    }
  }

  @OnEvent('gameroom:unready')
  async unreadyGame(roomId: number, userId: number) {
    this.logger.log(`Called ${this.unreadyGame.name}`);
    const room = this.gameRoomService.getGameRoomInfo(roomId);
    if (room.redUser?.userId === userId) {
      room.redUser.gameUserStatus = GameRoomUserStatus.UN_READY;
      this.server
        .in(`gameroom-${roomId}`)
        .emit('unReadyRedUser', room.redUser.userId);
    }
    if (room.blueUser?.userId === userId) {
      room.blueUser.gameUserStatus = GameRoomUserStatus.UN_READY;
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

    // 빠른 대전 게임방을 생성, 레드 유저를 먼저 넣어줍니다.
    const roomId = this.gameRoomService.getGameRoomCount() + 1;
    const redUser: GameUserStatusDto = {
      ...(await this.userService.getUserInfo(redUserId)),
      gameUserStatus: GameRoomUserStatus.UN_READY,
    };

    await this.eventEmitter.emitAsync('gameroom:create', redUser, {
      mode: GameRoomMode.NORMAL,
      type: matchType,
      winScore: 10,
      title: 'Quickplay Arena',
      maxSpectatorCount: 5,
    } as GameRoomCreateRequestDto);
    // 게임방에 입장
    this.eventEmitter.emit('gameroom:join', roomId, redUser);

    const gameRoom = this.gameRoomService.getGameRoomInfo(roomId);

    // 블루 유저를 게임방에 넣어줍니다.
    gameRoom.blueUser = {
      ...(await this.userService.getUserInfo(blueUserId)),
      gameUserStatus: GameRoomUserStatus.UN_READY,
    };
    this.eventEmitter.emit('gameroom:join', roomId, gameRoom.blueUser);

    // 게임이 매칭되었다는 메시지를 보냅니다.
    this.server.in(`gameroom-${roomId}`).emit('gameRoomMatched', gameRoom);

    this.gameRoomService.createGameRoom(roomId, gameRoom);
  }

  @OnEvent('gameroom:start')
  async startGame(roomId: number) {
    this.logger.log(`Called ${this.startGame.name}`);
    const room = this.gameRoomService.getGameRoomInfo(roomId);

    //gameInstance는 생성과 동시에 게임이 시작합니다.
    room.gameInstance = new GameInstance(
      roomId,
      room.winScore,
      room.mode,
      this.server,
      this.eventEmitter,
    );
    room.gameInstance.startGame();
  }

  @OnEvent('gameroom:finish')
  async onGameFinish(roomId: number, userId?: number) {
    this.logger.log(`Called ${this.onGameFinish.name}`);
    const room = this.gameRoomService.getGameRoomInfo(roomId);
    // 유저를 unready 상태로 변경
    this.eventEmitter.emit('gameroom:unready', roomId, room.redUser?.userId);
    this.eventEmitter.emit('gameroom:unready', roomId, room.blueUser?.userId);

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
    if (userId) {
      if (this.gameRoomService.isRedUser(roomId, userId)) {
        matchHistory.redScore = -1;
      } else if (this.gameRoomService.isBlueUser(roomId, userId)) {
        matchHistory.blueScore = -1;
      }
      this.server.in(`gameroom-${room.roomId}`).emit(InGameEvent.SCORE, {
        redScore: matchHistory.redScore,
        blueScore: matchHistory.blueScore,
      });
    }
    await this.statService.createMatchHistory(matchHistory);
  }

  //폐기예정
  @OnEvent('gameroom:config')
  pushConfig(client) {
    client.emit(InGameEvent.CONFIG, GameInstance.makeSetConfig());
  }

  @SubscribeMessage('keyDown')
  setKeyDownEvent(client, { roomId, userId, keyCode }) {
    const room = this.gameRoomService.getGameRoomInfo(roomId);
    if (!(room?.redUser.userId === userId || room?.blueUser.userId === userId))
      return;
    if (room.status !== GameRoomStatus.ON_GAME) return;

    const user =
      room.redUser.userId === userId ? InGamePlayer.RED : InGamePlayer.BLUE;
    if (keyCode === 'ArrowUp') {
      room.gameInstance.setPaddleDirection(user, InGameKeyEvent.ARROW_UP);
    } else if (keyCode === 'ArrowDown') {
      room.gameInstance.setPaddleDirection(user, InGameKeyEvent.ARROW_DOWN);
    }
  }

  @SubscribeMessage('keyUp')
  setKeyUpEvent(client, { roomId, userId }) {
    const room = this.gameRoomService.getGameRoomInfo(roomId);

    if (!(room?.redUser.userId === userId || room?.blueUser.userId === userId))
      return;
    if (room.status !== GameRoomStatus.ON_GAME) return;

    const user: InGamePlayer =
      room.redUser.userId === userId ? InGamePlayer.RED : InGamePlayer.BLUE;
    room.gameInstance.setPaddleDirection(user, InGameKeyEvent.STOP);
  }
}
