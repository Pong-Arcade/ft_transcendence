import { createContext, useContext } from "react";
import { io, Socket } from "socket.io-client";
import { getCookie } from "../utils/cookie";
import { useNavigate } from "react-router-dom";

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

// FIXME: 적절한 위치로 옮겨야 함
// const navigate = useNavigate();
// gameSocket.socket.on("connect_error", (err) => {
//   console.log(`connect_error due to ${err.message}`);
//   navigate("/lobby");
// });

export const GameSocket = createContext(gameSocket);

export default GameSocket;
