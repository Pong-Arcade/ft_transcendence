import { GameRoomMode } from 'src/enum/gameroom.mode.enum';
import { GameRoomStatus } from 'src/enum/gameroom.status.enum';
import { MatchType } from 'src/enum/match.type.enum';

export class GameRoom {
  roomId: number;
  redUserId: number;
  blueUserId: number;
  maxSpectatorCount: number;
  status: GameRoomStatus;
  title: string;
  mode: GameRoomMode;
  type: MatchType;
  winScore: number;
  spectatorUsers: Array<number>;
  constructor(
    roomId: number,
    redUserId: number,
    mode: GameRoomMode,
    type: MatchType,
    winScore: number,
    title: string,
    maxSpectatorCount: number,
  ) {
    this.roomId = roomId;
    this.redUserId = redUserId;
    this.mode = mode;
    this.type = type;
    this.winScore = winScore;
    this.title = title;
    this.maxSpectatorCount = maxSpectatorCount;
    this.status = GameRoomStatus.ON_READY;
    this.spectatorUsers = new Array<number>();
  }
}
