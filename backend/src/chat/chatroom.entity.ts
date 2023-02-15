import { ChatRoomMode } from 'src/enum/chatroom.mode.enum';

export class Room {
  id: number;
  roomname: string;
  type: ChatRoomMode;
  password: string;
  maxUser: number;
  users: Array<number>;
  bannedUsers: Array<number>;
  constructor(
    id: number,
    roomname: string,
    type: ChatRoomMode,
    password: string,
    maxUser: number,
    creator: number,
  ) {
    this.id = id;
    this.roomname = roomname;
    this.type = type;
    this.password = password;
    this.maxUser = maxUser;
    this.users = new Array<number>();
    this.bannedUsers = new Array<number>();
  }
}
