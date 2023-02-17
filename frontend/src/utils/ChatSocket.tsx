import { io, Socket } from "socket.io-client";

class ChatSocket {
  socket: Socket;
  userid: number;
  username: string;
  // ignore_list: Array<number>;

  // addMessage(msg: string) {
  //   const chatList = document.getElementById("");
  // }
  constructor(userid: number, name: string) {
    this.socket = io("ws://localhost:80/socket/chat");
    this.userid = userid;
    this.username = name;
  }
}

export default ChatSocket;
