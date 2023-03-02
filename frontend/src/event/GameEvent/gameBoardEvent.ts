import { RefObject, useContext, useEffect, useRef, useState } from "react";
import { IGameBoardState } from "../../state/GameBoardState";
import GameSocket from "../../state/GameSocket";

interface IScore {
  redScore: number;
  blueScore: number;
}

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
  gameBoard: IGameBoardState;
  canvasRef: RefObject<HTMLCanvasElement>;
  roomId: number;
  userId: number;
}

const gameBaordEvent = ({ gameBoard, canvasRef, roomId, userId }: Props) => {
  const { socket } = useContext(GameSocket);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const updateBoardRef = useRef<IUpdateBoard>({
    ball: gameBoard.ball,
    redPaddle: gameBoard.redPaddle,
    bluePaddle: gameBoard.bluePaddle,
  });
  const scoreRef = useRef<IScore>({
    redScore: 0,
    blueScore: 0,
  });

  const drawBoard = (ctx: CanvasRenderingContext2D) => {
    ctx.beginPath();
    ctx.fillStyle = "rgba(3, 169, 244, 0.5)";
    ctx.rect(0, 0, gameBoard.gameCanvas.width, gameBoard.gameCanvas.height);
    ctx.fill();
    ctx.lineWidth = 10;
    ctx.strokeStyle = "rgba(2, 136, 209, 1)";
    ctx.stroke();

    ctx.closePath();
  };

  const drawBall = (ctx: CanvasRenderingContext2D) => {
    ctx.beginPath();
    ctx.arc(
      updateBoardRef.current.ball.x,
      updateBoardRef.current.ball.y,
      gameBoard.ball.size,
      0,
      Math.PI * 2
    );
    ctx.fillStyle = "#263238";
    ctx.fill();
    ctx.closePath();
  };

  const drawPaddle = (
    ctx: CanvasRenderingContext2D,
    fillStyle: string,
    x: number,
    y: number
  ) => {
    if (fillStyle === "red") fillStyle = "rgba(255, 0, 0, 0.75)";
    else if (fillStyle === "blue") fillStyle = "rgba(0, 0, 255, 0.75)";
    ctx.fillStyle = fillStyle;
    ctx.fillRect(x, y, gameBoard.paddle.width, gameBoard.paddle.height);
  };

  const drawScore = (
    ctx: CanvasRenderingContext2D,
    score: number,
    x: number,
    y: number
  ) => {
    ctx.fillStyle = "rgba(0,0,0,0.2)";
    ctx.font = "50px Arial";
    ctx.fillText(score.toString(), x, y);
  };
  const drawMiddleLine = (ctx: CanvasRenderingContext2D) => {
    const mid_width = 4;
    const x = (gameBoard.gameCanvas.width - mid_width) * 0.5;
    let y = 0;
    const step = gameBoard.gameCanvas.height / 20;

    while (y < gameBoard.gameCanvas.height) {
      ctx.fillRect(x, y + step * 0.25, mid_width, step * 0.5);
      y += step;
    }
  };

  const draw = () => {
    if (ctx) {
      drawBoard(ctx);
      drawScore(
        ctx,
        scoreRef.current.redScore,
        gameBoard.gameCanvas.width / 4,
        gameBoard.gameCanvas.height * 0.1
      );
      drawScore(
        ctx,
        scoreRef.current.blueScore,
        (3 * gameBoard.gameCanvas.width) / 4,
        gameBoard.gameCanvas.height * 0.1
      );

      drawMiddleLine(ctx);

      drawBall(ctx);
      drawPaddle(
        ctx,
        "blue",
        updateBoardRef.current.bluePaddle.x,
        updateBoardRef.current.bluePaddle.y
      );
      drawPaddle(
        ctx,
        "red",
        updateBoardRef.current.redPaddle.x,
        updateBoardRef.current.redPaddle.y
      );
    }
  };

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
    setCtx(canvasRef.current?.getContext("2d") as CanvasRenderingContext2D);
    window.requestAnimationFrame(draw);

    socket.on("update", (update: IUpdateBoard) => {
      updateBoardRef.current = update;
      window.requestAnimationFrame(draw);
    });
    socket.on("score", (score: IScore) => {
      scoreRef.current = score;
    });

    document.addEventListener("keyup", keyUpEvent);
    document.addEventListener("keydown", keyDownEvent);

    return () => {
      socket.off("update");
      socket.off("score");
      document.removeEventListener("keyup", keyUpEvent);
      document.removeEventListener("keydown", keyDownEvent);
    };
  }, [ctx]);
};

export default gameBaordEvent;
