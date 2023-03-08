import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { EGameUserStatus } from "../../components/modules/Pagination/Pagination";
import errorState from "../../state/ErrorState";
import gameRoomState from "../../state/GameRoomState";
import GameSocket from "../../state/GameSocket";
import { SocketContext } from "../../utils/ChatSocket";

const gameRoomEvent = () => {
  const { socket } = useContext(GameSocket);
  const setGameState = useSetRecoilState(gameRoomState);
  const naviagte = useNavigate();
  const setError = useSetRecoilState(errorState);
  const chatSocket = useContext(SocketContext);

  useEffect(() => {
    socket.on("joinGameRoom", (joinUser) => {
      setGameState((prev) => {
        if (prev.redUser.userId === joinUser.userId) return prev;
        return {
          ...prev,
          blueUser: { ...joinUser, status: EGameUserStatus.UN_READY },
        };
      });
    });

    socket.on("leaveGameRoom", () => {
      setGameState((prev) => ({
        ...prev,
        blueUser: {},
      }));
    });

    socket.on("destructGameRoom", () => {
      naviagte("/lobby");
    });

    socket.on("readyRedUser", () => {
      setGameState((prev) => ({
        ...prev,
        redUser: { ...prev.redUser, gameUserStatus: EGameUserStatus.READY },
      }));
    });
    socket.on("unReadyRedUser", () => {
      setGameState((prev) => ({
        ...prev,
        redUser: { ...prev.redUser, gameUserStatus: EGameUserStatus.UN_READY },
      }));
    });
    socket.on("readyBlueUser", () => {
      setGameState((prev) => ({
        ...prev,
        blueUser: { ...prev.blueUser, gameUserStatus: EGameUserStatus.READY },
      }));
    });
    socket.on("unReadyBlueUser", () => {
      setGameState((prev) => ({
        ...prev,
        blueUser: {
          ...prev.blueUser,
          gameUserStatus: EGameUserStatus.UN_READY,
        },
      }));
    });
    socket.on("connect_unauth_error", (err) => {
      setError({ isError: true, error: err.message });
    });
    chatSocket.socket.on("connect_unauth_error", (err) => {
      setError({ isError: true, error: err.message });
    });

    return () => {
      socket.off("joinGameRoom");
      socket.off("leaveGameRoom");
      socket.off("destructGameRoom");
      socket.off("readyRedUser");
      socket.off("unReadyRedUser");
      socket.off("readyBlueUser");
      socket.off("unReadyBlueUser");
      socket.off("connect_unauth_error");
      chatSocket.socket.off("connect_unauth_error");
    };
  }, []);
};

export default gameRoomEvent;
