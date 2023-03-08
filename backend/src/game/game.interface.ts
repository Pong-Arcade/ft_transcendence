export interface Coordinate {
  x: number;
  y: number;
}

export interface Canvas {
  width: number;
  height: number;
}

export interface Paddle {
  width: number;
  height: number;
  velocity: number;
}

export interface Ball {
  size: number;
  velocity: number;
}
