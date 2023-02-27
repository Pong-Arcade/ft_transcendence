import { Coordinate } from '../game/game.interface';

export class InGameUpdateDto {
  ball: Coordinate;
  redPaddle: Coordinate;
  bluePaddle: Coordinate;
}
export { Coordinate };
