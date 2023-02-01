export class Room {
  id: number;
  roomname: string;
  type: number;
  password: string;
  maxUser: number;
  Users: Array<number>;
  creator: number;
  admin: Array<number>;
  constructor(
    id: number,
    roomname: string,
    type: number,
    password: string,
    maxUser: number,
    creator: number,
  ) {
    this.id = id;
    this.roomname = roomname;
    this.type = type;
    this.password = password;
    this.maxUser = maxUser;
    this.Users = new Array<number>();
    this.Users.push(creator);
    this.creator = creator;
  }
}

export class User {
  userid: number;
  username: string;
  socketid: string;
  location: number;
  constructor(
    userid: number,
    username: string,
    socketid: string,
    location: number,
  ) {
    this.userid = userid;
    this.username = username;
    this.socketid = socketid;
    this.location = location;
  }
}
