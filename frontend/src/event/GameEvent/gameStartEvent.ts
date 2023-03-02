import { useContext, useEffect, useState } from "react";
import GameSocket from "../../state/GameSocket";

const gameStartEvent = () => {
  const { socket } = useContext(GameSocket);
  const [timeLimit, setTimeLimit] = useState(0);
  const [isCountDown, setCountDown] = useState(false);

  useEffect(() => {
    socket.on("startGame", () => {
      console.log("game start"); //TODO:
    });

    socket.on("readyTick", (timeLimit: number) => {
      if (!isCountDown) setCountDown(true);
      setTimeLimit(timeLimit);
    });
    // 업데이트 이벤트 등록
    // 키 이벤트 보내야 함
    return () => {
      socket.off("startGame");
      socket.off("readyTick");
    };
  }, []);
  return { isCountDown, timeLimit };
};

export default gameStartEvent;
