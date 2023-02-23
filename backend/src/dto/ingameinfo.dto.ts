import { Ball, Canvas, Paddle } from '../game/game.interface';
import { UserDto } from './user.dto';

export class InGameRoomInfoDto {
  player1: UserDto & { score: number };
  player2: UserDto & { score: number };
  gameScreen: Canvas;
  paddle: Paddle;
  ball: Ball;
  winScore: number;
  beginDate: Date;
  fps: 25;
}
