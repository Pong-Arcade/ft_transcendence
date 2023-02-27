import { useContext, useEffect, useState } from "react";
import GameSocket from "../../state/GameSocket";

const gameStartEvent = () => {
  const [isGameStart, setGameStart] = useState(false);
  const { socket } = useContext(GameSocket);

  useEffect(() => {
    socket.on("startGame", () => {
      setGameStart(true);
    });

    return () => {
      socket.off("startGame");
    };
  }, []);
  return isGameStart;
};

export default gameStartEvent;
