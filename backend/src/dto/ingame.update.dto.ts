import { Coordinate } from '../game/game.interface';

export class InGameUpdateDto {
  ball: Coordinate;
  paddle1: Coordinate;
  paddle2: Coordinate;
}
export { Coordinate };
