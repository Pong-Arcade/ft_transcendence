import { useRef } from "react";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import gameBaordEvent from "../../../event/GameEvent/gameBoardEvent";
import gameBoardState from "../../../state/GameBoardState";
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
interface Props {
  roomId: number;
  userId: number;
}

const GameBoard = ({ roomId, userId }: Props) => {
  const gameBoard = useRecoilValue(gameBoardState);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  gameBaordEvent({ gameBoard, canvasRef, roomId, userId });

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
