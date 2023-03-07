import { createContext } from "react";
import { io, Socket } from "socket.io-client";
import { getCookie } from "../utils/cookie";

interface IGameSocket {
  socket: Socket;
  userId: number;
  userName: string;
}

const gameSocket: IGameSocket = {
  socket: io(`${import.meta.env.VITE_SOCKET_URL}/socket/game`, {
    auth: {
      token: getCookie(),
    },
  }),
  userId: -1,
  userName: "",
};

export const GameSocket = createContext(gameSocket);

export default GameSocket;
