import { useContext, useEffect, useRef, useState } from "react";
import { useSetRecoilState } from "recoil";
import { readyGameRoomAPI, unReadyGameRoomAPI } from "../../api/room";
import errorState from "../../state/ErrorState";
import GameSocket from "../../state/GameSocket";
import { IScore } from "./gameBoardEvent";

const gameStartEvent = (roomId: number) => {
  const { socket } = useContext(GameSocket);
  const [isReady, setReady] = useState(false);
  const [timeLimit, setTimeLimit] = useState(0);
  const [isOnGame, setOnGame] = useState(false);
  const [isGameFinish, setGameFinish] = useState(false);
  const scoreRef = useRef<IScore>({
    redScore: 0,
    blueScore: 0,
  });

  useEffect(() => {
    socket.on("finish", () => {
      setOnGame(false);
      setReady(false);
      setGameFinish(true);
    });

    socket.on("readyTick", (timeLimit: number) => {
      if (!isOnGame) setOnGame(true);
      setTimeLimit(timeLimit);
    });

    return () => {
      socket.off("finish");
      socket.off("readyTick");
    };
  }, []);

  const setError = useSetRecoilState(errorState);
  const onReady = async () => {
    try {
      if (!isReady) await readyGameRoomAPI(roomId);
      else await unReadyGameRoomAPI(roomId);
      setReady((prev) => !prev);
    } catch (error) {
      setError({ isError: true, error });
    }
  };

  return {
    onReady,
    isReady,
    isOnGame,
    timeLimit,
    scoreRef,
    isGameFinish,
    setGameFinish,
  };
};

export default gameStartEvent;
