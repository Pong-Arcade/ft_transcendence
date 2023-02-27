import { Ball, Canvas, Paddle } from '../game/game.interface';

export class InGameRoomInfoDto {
  roomId: number;
  SocketServer;
  gameScreen: Canvas;
  paddle: Paddle;
  ball: Ball;
  winScore: number;
  redScore: number;
  blueScore: number;
  beginDate: Date;
  fps: number;
}
