import { UserDto } from './user.dto';

export class GameResultDto {
  beginDate: Date;
  endDate: Date;
  winner: UserDto;
  loser: UserDto;
  point?: number;
}
