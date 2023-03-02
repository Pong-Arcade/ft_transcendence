import { MutableRefObject, useRef } from "react";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import gameBaordEvent, {
  IScore,
} from "../../../event/GameEvent/gameBoardEvent";
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
  isOnGame: boolean;
  scoreRef: MutableRefObject<IScore>;
}

const GameBoard = ({ roomId, userId, isOnGame, scoreRef }: Props) => {
  const gameBoard = useRecoilValue(gameBoardState);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  gameBaordEvent({ gameBoard, canvasRef, roomId, userId, isOnGame, scoreRef });

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
