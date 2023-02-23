import { InGameRoomInfoDto } from 'src/dto/ingameinfo.dto';
import { InGameKeyEvent, InGamePlayer } from 'src/enum/ingame.event.enum';
import { Coordinate, InGameUpdateDto } from '../dto/ingame.update.dto';
import { Socket } from 'socket.io';

export class GameInstance {
  info: InGameRoomInfoDto;
  state: InGameUpdateDto;

  ballVelocity: number;
  ballDx: number;
  ballDy: number;

  paddleDirection1: number;
  paddleDirection2: number;

  round: number;
  scored: boolean;

  intervalId: NodeJS.Timeout;

  frames: number;
  pause: number;

  constructor(info: InGameRoomInfoDto) {
    this.info = info;
    this.intervalId = null;
    this.gameInit();
  }

  private setPauseTime(t = -1) {
    this.pause = t;
    this.frames = 0;
  }

  private incrementFrames() {
    if (this.pause > 0) {
      this.frames++;
    }
  }

  private isPause(): boolean {
    if (this.pause >= 0 && this.pause >= this.frames / this.info.fps) {
      return true;
    } else if (this.pause < 0) {
      return false;
    }
    this.setPauseTime();
    return false;
  }

  private calcVectorLength(v1: number, v2: number): number {
    return Math.sqrt(v1 * v1 + v2 * v2);
  }

  private gameInit() {
    this.scored = false;
    this.round = 0;
    this.info.redScore = 0;
    this.info.blueScore = 0;
    this.setPauseTime();
    this.ballInit();
    this.paddleInit();
  }

  private ballInit() {
    this.state.ball.x = this.info.gameScreen.width / 2;
    this.state.ball.y = this.info.gameScreen.height / 2;
    this.randomBallDirection();
  }

  private paddleInit() {
    this.state.paddle1.y =
      (this.info.gameScreen.height - this.info.paddle.height) / 2;
    this.state.paddle2.y =
      (this.info.gameScreen.height - this.info.paddle.height) / 2;

    //임시 값
    this.state.paddle1.x = 10;
    this.state.paddle2.x = 10;
  }

  private randomBallDirection() {
    this.ballDx = this.round % 2 == 0 ? 1 : -1;
    this.ballDy = Math.round(Math.random() * 2 - 1);
    const vectorLeng = this.calcVectorLength(this.ballDx, this.ballDy);
    this.ballDx /= vectorLeng;
    this.ballDy /= vectorLeng;
  }

  public setPaddleDirection(playerNumber: number, keyEvent: InGameKeyEvent) {
    if (playerNumber === 0) {
      this.paddleDirection1 = keyEvent as number;
    } else {
      this.paddleDirection2 = keyEvent as number;
    }
  }

  private updatePaddle(paddle: Coordinate) {
    let tempY =
      paddle.y +
      (this.info.paddle.velocity * this.paddleDirection1) / this.info.fps;
    if (tempY < 0) {
      tempY = 0;
    } else if (tempY + this.info.paddle.height >= this.info.gameScreen.height) {
      tempY = this.info.gameScreen.height - this.info.paddle.height;
    }
    paddle.y = tempY;
  }

  private calcNextBall() {
    let nextBallX =
      this.state.ball.x +
      Math.round((this.info.ball.velocity * this.ballDx) / this.info.fps);
    let nextBallY =
      this.state.ball.y +
      Math.round((this.info.ball.velocity * this.ballDy) / this.info.fps);
    let tempBallDx = this.ballDx;
    let tempBallDy = this.ballDy;
    const ballSize = this.info.ball.size;

    //승점 처리, 충돌 처리!
    if (nextBallX < 0) {
      //player2 win
      this.scored = true;
      this.info.blueScore++;
      nextBallX = 0;
    } else if (nextBallX > this.info.gameScreen.width) {
      //player1 win
      this.scored = true;
      this.info.redScore++;
      nextBallX = this.info.gameScreen.width;
    } else if (nextBallY < 0) {
      //천장 충돌
      nextBallY = 0;
      tempBallDy *= -1;
    } else if (nextBallY > this.info.gameScreen.height) {
      //바닥 충돌
      nextBallY = this.info.gameScreen.height;
      tempBallDy *= -1;
    } else {
      //패들 충돌
      const paddle = tempBallDx >= 0 ? this.state.paddle2 : this.state.paddle1;
      if (
        this.isIntersection(
          nextBallX,
          nextBallY,
          ballSize,
          ballSize,
          paddle.x,
          paddle.y,
          this.info.paddle.width,
          this.info.paddle.height,
        )
      ) {
        tempBallDx *= -1;
      }
    }

    this.state.ball.x = nextBallX;
    this.state.ball.y = nextBallY;
    this.ballDx = tempBallDx;
    this.ballDy = tempBallDy;
  }

  private isIntersection(ax, ay, aw, ah, bx, by, bw, bh): boolean {
    return ax < bx + bw && ay < by + bh && bx < ax + aw && by < ay + ah;
  }

  public updateGame() {
    this.incrementFrames();
    this.updatePaddle(this.state.paddle1);
    this.updatePaddle(this.state.paddle2);
    if (this.isPause() === false) {
      this.calcNextBall();
      if (this.scored === true) {
        this.scored = false;
        this.round++;
        this.setPauseTime(3);
        this.ballInit();
        this.paddleInit();
        //방인원에게 점수 이벤트 전달
        if (
          this.info.redScore >= this.info.winScore ||
          this.info.blueScore >= this.info.winScore
        ) {
          this.finishGame();
        }
      }
    }
    //방인원에게 게임 업데이트 이벤트 전달
  }

  /**
   * 그 어떤 경우에도 종료될때 해당함수를 거처야함
   * 정상 종료: 승점 달성
   * 비정상 종료: 플레이어 이탈
   */
  public finishGame() {
    clearInterval(this.intervalId);
    this.intervalId = null;
    //방인원에게 게임 종료 이벤트 전달
  }

  public startGame() {
    this.gameInit();
    //방인원들에게 게임 시작 이벤트 전달
    this.intervalId = setInterval(
      this.updateGame.bind(this),
      1000 / this.info.fps,
    );
  }

  public joinPlayer(player: InGamePlayer, socket: Socket) {
    if (player === InGamePlayer.RED) {
      this.info.redPlayer = socket;
    } else if (player === InGamePlayer.BLUE) {
      this.info.bluePlayer = socket;
    }
  }

  public leavePlayerForceFinish(player: InGamePlayer) {
    if (this.intervalId !== null) {
      this.finishGame();
    }
    if (player === InGamePlayer.RED) {
      this.info.redPlayer = null;
    } else if (player === InGamePlayer.BLUE) {
      this.info.bluePlayer = null;
    }
  }
}
