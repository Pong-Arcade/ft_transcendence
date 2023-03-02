import { atom } from "recoil";

export interface IGameBoardState {
  gameCanvas: {
    width: number;
    height: number;
  };
  paddle: {
    width: number;
    height: number;
  };
  ball: {
    size: number;
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

const gameBoardState = atom<IGameBoardState>({
  key: "gameBoardState",
  default: {
    gameCanvas: {
      width: 0,
      height: 0,
    },
    paddle: {
      width: 0,
      height: 0,
    },
    ball: {
      size: 0,
      x: 0,
      y: 0,
    },
    redPaddle: {
      x: 0,
      y: 0,
    },
    bluePaddle: {
      x: 0,
      y: 0,
    },
  },
});
export default gameBoardState;
