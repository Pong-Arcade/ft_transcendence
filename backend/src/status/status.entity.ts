export class User {
  userid: number;
  username: string;
  socketid: string;
  location: number; // 음수: 게임방 번호, 0: 로비, 양수: 채팅방 번호
  constructor(userid: number, username: string, socketid: string) {
    this.userid = userid;
    this.username = username;
    this.socketid = socketid;
    this.location = 0;
  }
}
