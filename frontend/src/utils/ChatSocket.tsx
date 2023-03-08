import { createContext } from "react";
import { io, Socket } from "socket.io-client";
import { getCookie } from "./cookie";

class ChatSocket {
  socket: Socket;
  userId: number;
  userName: string;

  constructor() {
    this.socket = io(`${import.meta.env.VITE_SOCKET_URL}/socket/chat`, {
      auth: {
        token: getCookie(),
      },
    });
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
