import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { EGameUserStatus } from "../../components/modules/Pagination/Pagination";
import gameRoomState from "../../state/GameRoomState";
import GameSocket from "../../state/GameSocket";

const gameRoomEvent = () => {
  const { socket } = useContext(GameSocket);
  const setGameState = useSetRecoilState(gameRoomState);
  const naviagte = useNavigate();

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
      // console.log(`userId : ${userId} 님이 방을 떠났습니다`); //TODO: 채팅 처리를 위한 것인지 확인
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
        redUser: { ...prev.redUser, status: EGameUserStatus.READY },
      }));
    });
    socket.on("unReadyRedUser", () => {
      setGameState((prev) => ({
        ...prev,
        redUser: { ...prev.redUser, status: EGameUserStatus.UN_READY },
      }));
    });
    socket.on("readyBlueUser", () => {
      setGameState((prev) => ({
        ...prev,
        blueUser: { ...prev.blueUser, status: EGameUserStatus.READY },
      }));
    });
    socket.on("unReadyBlueUser", () => {
      setGameState((prev) => ({
        ...prev,
        blueUser: { ...prev.blueUser, status: EGameUserStatus.UN_READY },
      }));
    });
    return () => {
      socket.off("joinGameRoom");
      socket.off("leaveGameRoom");
      socket.off("destructGameRoom");
      socket.off("readyRedUser");
      socket.off("unReadyRedUser");
      socket.off("readyBlueUser");
      socket.off("unReadyBlueUser");
    };
  }, []);
};

export default gameRoomEvent;
