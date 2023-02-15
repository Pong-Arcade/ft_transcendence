import { io, Socket } from "socket.io-client";
import { useState } from "react";

class ChatSocket {
  socket: Socket;
  userid: number;
  username: string;
  // ignore_list: Array<number>;

  addMessage(msg: string) {
    const chatList = document.getElementById("");
  }
  constructor(userid: number, name: string) {
    this.socket = io("ws://localhost:80/socket/chat");
    this.userid = userid;
    this.username = name;
    this.socket.emit("addUser", {
      username: this.username,
      userid: this.userid,
    });
  }
}

export default ChatSocket;
