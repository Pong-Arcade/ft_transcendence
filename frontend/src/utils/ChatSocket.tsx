import { createContext } from "react";
import { io, Socket } from "socket.io-client";

class ChatSocket {
  socket: Socket;
  userId: number;
  userName: string;
  // ignore_list: Array<IUser>;

  // constructor(userId: number, userName: string) {
  //   this.socket = io("ws://localhost:80/socket/chat");
  //   this.userId = userId;
  //   this.userName = userName;
  // }
  constructor() {
    this.socket = io("ws://localhost:80/socket/chat");
    this.userId = -1;
    this.userName = "";
  }
  setUser(id: number, name: string) {
    this.userId = id;
    this.userName = name;
  }
}

export const socket = new ChatSocket();
export const SocketContext = createContext(socket);

export default ChatSocket;
