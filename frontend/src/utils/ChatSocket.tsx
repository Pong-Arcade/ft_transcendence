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
  newMessage(msg: any) {
    console.log(msg);
  }
  constructor(userid: number, name: string) {
    // this.ignore_list.
    this.socket = io("localhost:4242", {
      transports: ["websocket"],
    });
    this.userid = userid;
    this.username = name;
    this.socket.emit("addUser", {
      username: this.username,
      userid: this.userid,
    });
    // this.socket.on("message", this.newMessage);
    // this.socket.emit("createRoom", {
    //   roomname: "test1",
    //   type: "1",
    //   maxUser: 3,
    //   creator: this.userid,
    // });
    this.socket.emit("showRoom");
    this.socket.on("showRoom", this.newMessage);
  }
}

export default ChatSocket;
