import { useContext, useEffect, useRef, useState } from "react";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import gameBoardState from "../../../state/GameBoardState";
import GameSocket from "../../../state/GameSocket";
import Board from "../../atoms/Board";

const GameBoardSteyld = styled(Board).attrs((props) => {
  return {
    width: "75%",
    height: "98%",
    backgroundColor: props.theme.background.middle,
    borderRadius: true,
    boxShadow: true,
  };
})``;

interface IUpdateBoard {
  ball: {
    x: number;
    y: number;
  };
  redPaddle: {
    x: number;
    y: number;
  };
  bluePaddle: {
    x: number;
    y: number;
  };
}
interface Props {
  roomId: number;
  userId: number;
}

interface IScore {
  redScore: number;
  blueScore: number;
}

const GameBoard = ({ roomId, userId }: Props) => {
  const gameBoard = useRecoilValue(gameBoardState);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { socket } = useContext(GameSocket);
  //TODO: Ref 로변경
  const [updateBoard, setUpdateBoard] = useState<IUpdateBoard>({
    ball: gameBoard.ball,
    redPaddle: gameBoard.redPaddle,
    bluePaddle: gameBoard.bluePaddle,
  });
  const [score, setScore] = useState<IScore>({
    redScore: 0,
    blueScore: 0,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "white";
      ctx.fillRect(
        0,
        0,
        gameBoard.gameCanvas.width,
        gameBoard.gameCanvas.height
      );

      ctx.fillStyle = "red";
      ctx.font = "20px Arial";
      ctx.fillText(
        score.redScore.toString(),
        gameBoard.gameCanvas.width / 4,
        gameBoard.gameCanvas.height / 5
      );

      ctx.fillText(
        score.blueScore.toString(),
        (3 * gameBoard.gameCanvas.width) / 4,
        gameBoard.gameCanvas.height / 5
      );

      const mid_width = 4;
      const x = (gameBoard.gameCanvas.width - mid_width) * 0.5;
      let y = 0;
      const step = gameBoard.gameCanvas.height / 20;

      // draw half line
      while (y < gameBoard.gameCanvas.height) {
        ctx.fillRect(x, y + step * 0.25, mid_width, step * 0.5);
        y += step;
      }

      ctx.fillStyle = "black";
      ctx.fillRect(
        updateBoard.ball.x,
        updateBoard.ball.y,
        gameBoard.ball.size,
        gameBoard.ball.size
      );
      ctx.fillStyle = "blue";
      ctx.fillRect(
        updateBoard.bluePaddle.x,
        updateBoard.bluePaddle.y,
        gameBoard.paddle.width,
        gameBoard.paddle.height
      );
      ctx.fillStyle = "red";
      ctx.fillRect(
        updateBoard.redPaddle.x,
        updateBoard.redPaddle.y,
        gameBoard.paddle.width,
        gameBoard.paddle.height
      );
    }
  });

  const keyUpEvent = (e: KeyboardEvent) => {
    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      socket.emit("keyUp", { roomId, userId });
    }
  };
  const keyDownEvent = (e: KeyboardEvent) => {
    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      if (!e.repeat) {
        socket.emit("keyDown", { roomId, userId, keyCode: e.key });
      }
    }
  };
  useEffect(() => {
    socket.on("update", (updateBoard: IUpdateBoard) => {
      setUpdateBoard(updateBoard);
    });
    socket.on("score", (score: IScore) => {
      setScore(score);
    });
    document.addEventListener("keyup", keyUpEvent);
    document.addEventListener("keydown", keyDownEvent);

    return () => {
      socket.off("update");
      document.removeEventListener("keyup", keyUpEvent);
      document.removeEventListener("keydown", keyDownEvent);
    };
  }, []);

  return (
    <GameBoardSteyld>
      <canvas
        ref={canvasRef}
        width={gameBoard.gameCanvas.width}
        height={gameBoard.gameCanvas.height}
      ></canvas>
    </GameBoardSteyld>
  );
};

export default GameBoard;
