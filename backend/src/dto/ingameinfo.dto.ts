import { Ball, Canvas, Paddle } from '../game/game.interface';
import { Socket } from 'socket.io';

export class InGameRoomInfoDto {
  redPlayer: Socket;
  bluePlayer: Socket;
  gameScreen: Canvas;
  paddle: Paddle;
  ball: Ball;
  winScore: number;
  redScore: number;
  blueScore: number;
  beginDate: Date;
  fps: 25;
}
