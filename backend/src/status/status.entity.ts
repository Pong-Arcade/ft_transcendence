export class User {
  userId: number;
  userName: string;
  socketId: string;
  gameSocketId: string;
  location: number; // 음수: 게임방 번호, 0: 로비, 양수: 채팅방 번호
  constructor(userid: number, username: string) {
    this.userId = userid;
    this.userName = username;
    this.location = 0;
  }
}
