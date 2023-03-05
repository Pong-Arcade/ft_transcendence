import { UserChatMode } from 'src/enum/user.chat.mode.enum';

export class User {
  userId: number;
  userName: string;
  socketId: string;
  gameSocketId: string;
  location: number; // 음수: 게임방 번호, 0: 로비, 양수: 채팅방 번호
  mode?: UserChatMode;
  constructor(userid: number, username: string) {
    this.userId = userid;
    this.userName = username;
    this.location = 0;
  }
}
