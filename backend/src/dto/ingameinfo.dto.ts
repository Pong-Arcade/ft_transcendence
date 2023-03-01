import { EventEmitter2 } from '@nestjs/event-emitter';
import { GameRoomMode } from 'src/enum/gameroom.mode.enum';
import { Ball, Canvas, Paddle } from '../game/game.interface';
import { InGameConfigDto } from './ingame.config.dto';

export class InGameRoomInfoDto {
  roomId: number;
  SocketServer;
  eventEmitter: EventEmitter2;
  gameScreen: Canvas;
  paddle: Paddle;
  ball: Ball;
  winScore: number;
  redScore: number;
  blueScore: number;
  beginDate: Date;
  fps: number;
  gameMode: GameRoomMode;
  gameConfig: InGameConfigDto;
}
