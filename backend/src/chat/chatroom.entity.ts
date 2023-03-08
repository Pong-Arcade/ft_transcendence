import { ChatRoomMode } from 'src/enum/chatroom.mode.enum';

export class Room {
  roomId: number;
  title: string;
  mode: ChatRoomMode;
  password: string;
  maxUser: number;
  users: Array<number>;
  bannedUsers: Array<number>;
  adminUsers: Array<number>;
  invitedUsers: Array<number>;
  masterUser: number;
  constructor(
    roomId: number,
    title: string,
    mode?: ChatRoomMode,
    password?: string,
    maxUser?: number,
    masterUser?: number,
  ) {
    this.roomId = roomId;
    this.title = title;
    this.mode = mode;
    this.password = password;
    this.maxUser = maxUser;
    this.masterUser = masterUser;
    this.users = new Array<number>();
    this.bannedUsers = new Array<number>();
    this.adminUsers = new Array<number>();
    this.invitedUsers = new Array<number>();
  }
}
