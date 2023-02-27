export class InGameConfigDto {
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
