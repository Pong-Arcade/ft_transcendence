/**
 * 채팅방 모드
 * PUBLIC: 공개 채팅방
 * PRIVATE: 비공개 채팅방(invite-only)
 * PROTECTED: 비밀번호 채팅방
 */
export enum ChatRoomMode {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
  PROTECTED = 'PROTECTED',
}
