import { GameRoomMode } from 'src/enum/gameroom.mode.enum';
import { MatchType } from 'src/enum/match.type.enum';

/**
 * 게임방 생성 요청 dto입니다.
 * mode: 게임방 모드
 * type: 대전 유형
 * title: 게임방 제목
 * password: 게임방 비밀번호
 * maxSpectatorCount: 최대 관전자 수
 */
export class GameRoomCreateRequestDto {
  mode: GameRoomMode;
  type: MatchType;
  title: string;
  password?: string;
  maxSpectatorCount: number;
}
