import { io, Socket } from "socket.io-client";

class ChatSocket {
  socket: Socket;
  userId: number;
  userName: string;
  // ignore_list: Array<number>;

  // addMessage(msg: string) {
  //   const chatList = document.getElementById("");
  // }
  constructor(userid: number, name: string) {
    this.socket = io("ws://localhost:80/socket/chat");
    this.userId = userid;
    this.userName = name;
  }
}

export default ChatSocket;
