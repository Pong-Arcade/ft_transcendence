import { GameUserStatusDto } from 'src/dto/game.user.status.dto';
import { GameRoomMode } from 'src/enum/gameroom.mode.enum';
import { GameRoomStatus } from 'src/enum/gameroom.status.enum';
import { MatchType } from 'src/enum/match.type.enum';

export class Invitation {
  invitationId: number; // 초대의 고유 id
  inviterId: number; // 초대자의 userId
  inviteeId: number; // 초대받는 사람의 userId
  expirationTime: Date; // 초대의 만료 시간
}

export class GameRoom {
  roomId: number;
  redUser: GameUserStatusDto;
  blueUser?: GameUserStatusDto;
  mode: GameRoomMode;
  type: MatchType;
  winScore: number;
  title: string;
  maxSpectatorCount: number;
  spectatorUsers: Array<number>;
  status: GameRoomStatus;
  invitedUsers: Array<number>;
  constructor(
    roomId: number,
    redUser: GameUserStatusDto,
    mode: GameRoomMode,
    type: MatchType,
    winScore: number,
    title: string,
    maxSpectatorCount: number,
  ) {
    this.roomId = roomId;
    this.redUser = redUser;
    this.mode = mode;
    this.type = type;
    this.winScore = winScore;
    this.title = title;
    this.maxSpectatorCount = maxSpectatorCount;
    this.status = GameRoomStatus.ON_READY;
    this.spectatorUsers = new Array<number>();
    this.invitedUsers = new Array<number>();
  }
}
