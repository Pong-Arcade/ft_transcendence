import { Ball, Canvas, Paddle } from '../game/game.interface';

export class InGameRoomInfoDto {
  gameScreen: Canvas;
  paddle: Paddle;
  ball: Ball;
  winScore: number;
  redScore: number;
  blueScore: number;
  beginData: Date;
  fps: 25;
}
