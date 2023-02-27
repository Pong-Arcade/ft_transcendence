import { createContext } from "react";
import { io, Socket } from "socket.io-client";

interface IGameSocket {
  socket: Socket;
  userId: number;
  userName: string;
}

const gameSocket: IGameSocket = {
  socket: io("ws://localhost:80/socket/game"),
  userId: -1,
  userName: "",
};

export const GameSocket = createContext(gameSocket);

export default GameSocket;