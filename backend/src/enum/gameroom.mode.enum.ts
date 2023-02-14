/**
 * 게임방 모드
 * PUBLIC: 공개 게임방
 * PRIVATE: 비공개 게임방(invite-only)
 * PROTECTED: 비밀번호 게임방
 */
export enum GameRoomMode {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
  PROTECTED = 'PROTECTED',
}
