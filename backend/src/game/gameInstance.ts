import {
  InGameEvent,
  InGameKeyEvent,
  InGamePlayer,
} from 'src/enum/ingame.event.enum';
import { InGameUpdateDto } from '../dto/ingame.update.dto';
import { InGameRoomInfoDto } from '../dto/ingameinfo.dto';
import * as gameConfig from './gameConfig.json';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InGameResultDto } from 'src/dto/ingame.result.dto';
import { GameRoomMode } from 'src/enum/gameroom.mode.enum';
import { InGameConfigDto } from 'src/dto/ingame.config.dto';

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

  constructor(
    roomId: number,
    winScore: number,
    mode: GameRoomMode,
    server,
    eventEmitter: EventEmitter2,
  ) {
    this.info = this.makeInfo(roomId, winScore, mode, server, eventEmitter);
    this.state = {
      ball: { x: 0, y: 0 },
      redPaddle: { x: 0, y: 0 },
      bluePaddle: { x: 0, y: 0 },
    };
    this.intervalId = null;
    this.gameInit();
  }

  static makeSetConfig(): InGameConfigDto {
    return {
      gameCanvas: {
        width: gameConfig.gameCanvas.width,
        height: gameConfig.gameCanvas.height,
      },
      paddle: {
        width: gameConfig.paddle.width,
        height: gameConfig.paddle.height,
      },
      ball: {
        size: gameConfig.ball.size,
        x: gameConfig.gameCanvas.width / 2,
        y: gameConfig.gameCanvas.height / 2,
      },
      redPaddle: {
        x: gameConfig.paddle.buffer,
        y: gameConfig.gameCanvas.height / 2 - gameConfig.paddle.height / 2,
      },
      bluePaddle: {
        x:
          gameConfig.gameCanvas.width -
          gameConfig.paddle.buffer -
          gameConfig.paddle.width,
        y: gameConfig.gameCanvas.height / 2 - gameConfig.paddle.height / 2,
      },
    };
  }

  private makeInfo(
    roomId,
    winScore: number,
    mode: GameRoomMode,
    server,
    eventEmitter: EventEmitter2,
  ): InGameRoomInfoDto {
    const info: InGameRoomInfoDto = {
      roomId: roomId,
      SocketServer: server,
      eventEmitter: eventEmitter,
      gameScreen: gameConfig.gameCanvas,
      paddle: gameConfig.paddle,
      ball: gameConfig.ball,
      winScore: winScore,
      redScore: 0,
      blueScore: 0,
      beginDate: new Date(),
      fps: gameConfig.fps,
      gameMode: mode,
      gameConfig: GameInstance.makeSetConfig(),
    };
    return info;
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
    this.paddleDirection1 = InGameKeyEvent.STOP;
    this.paddleDirection2 = InGameKeyEvent.STOP;
    this.setPauseTime();
    this.ballInit();
    this.paddleInit();
  }

  private ballInit() {
    this.state.ball.x = this.info.gameConfig.ball.x;
    this.state.ball.y = this.info.gameConfig.ball.y;
    this.ballVelocity =
      this.info.gameMode === GameRoomMode.NORMAL
        ? gameConfig.ball.velocity
        : gameConfig.ball.velocity * 2;
    this.randomBallDirection();
  }

  private paddleInit() {
    this.state.redPaddle.x = this.info.gameConfig.redPaddle.x;
    this.state.redPaddle.y = this.info.gameConfig.redPaddle.y;
    this.state.bluePaddle.x = this.info.gameConfig.bluePaddle.x;
    this.state.bluePaddle.y = this.info.gameConfig.bluePaddle.y;
  }

  private randomBallDirection() {
    this.ballDx = this.round % 2 == 0 ? 1 : -1;
    this.ballDy = Math.random() * 2 - 1;
    const vectorLeng = this.calcVectorLength(this.ballDx, this.ballDy);
    this.ballDx /= vectorLeng;
    this.ballDy /= vectorLeng;
  }

  public setPaddleDirection(player, keyEvent: number) {
    if (player === InGamePlayer.RED) {
      this.paddleDirection1 = keyEvent;
    } else {
      this.paddleDirection2 = keyEvent;
    }
  }

  private updatePaddle() {
    let tempY =
      this.state.redPaddle.y +
      (this.info.paddle.velocity * this.paddleDirection1) / this.info.fps;
    if (tempY < 0) {
      tempY = 0;
    } else if (tempY + this.info.paddle.height >= this.info.gameScreen.height) {
      tempY = this.info.gameScreen.height - this.info.paddle.height;
    }
    this.state.redPaddle.y = tempY;

    tempY =
      this.state.bluePaddle.y +
      (this.info.paddle.velocity * this.paddleDirection2) / this.info.fps;
    if (tempY < 0) {
      tempY = 0;
    } else if (tempY + this.info.paddle.height >= this.info.gameScreen.height) {
      tempY = this.info.gameScreen.height - this.info.paddle.height;
    }
    this.state.bluePaddle.y = tempY;
  }

  private calcNextBall() {
    let nextBallX: number =
      this.state.ball.x + (this.ballVelocity * this.ballDx) / this.info.fps;
    let nextBallY: number =
      this.state.ball.y + (this.ballVelocity * this.ballDy) / this.info.fps;
    let tempBallDx: number = this.ballDx;
    let tempBallDy: number = this.ballDy;
    const ballSize = this.info.ball.size;

    //승점 처리, 충돌 처리!
    if (nextBallX - gameConfig.ball.size < 0) {
      //player2 win
      this.scored = true;
      this.info.blueScore++;
      nextBallX = 0;
    } else if (nextBallX + gameConfig.ball.size > this.info.gameScreen.width) {
      //player1 win
      this.scored = true;
      this.info.redScore++;
      nextBallX = this.info.gameScreen.width;
    } else if (nextBallY - gameConfig.ball.size < 0) {
      //천장 충돌
      nextBallY = 0 + gameConfig.ball.size;
      tempBallDy *= -1;
    } else if (nextBallY + gameConfig.ball.size > this.info.gameScreen.height) {
      //바닥 충돌
      nextBallY = this.info.gameScreen.height - gameConfig.ball.size;
      tempBallDy *= -1;
    } else {
      //패들 충돌
      const paddle =
        tempBallDx >= 0 ? this.state.bluePaddle : this.state.redPaddle;
      if (
        this.checkCollision(
          nextBallX,
          nextBallY,
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

  private checkCollision(
    ballX,
    ballY,
    radius,
    paddleX,
    paddleY,
    paddleW,
    paddleH,
  ): boolean {
    const left = paddleX;
    const right = paddleX + paddleW;
    const top = paddleY;
    const bottom = paddleY + paddleH;

    if (
      (left <= ballX && ballX <= right) ||
      (top <= ballY && ballY <= bottom)
    ) {
      const leftEx = left - radius;
      const rightEx = right + radius;
      const topEx = top - radius;
      const bottomEx = bottom + radius;

      if (
        leftEx < ballX &&
        ballX < rightEx &&
        topEx < ballY &&
        ballY < bottomEx
      ) {
        return true;
      }
    } else {
      if (this.isPointonCircle(ballX, ballY, radius, left, top)) return true;
      if (this.isPointonCircle(ballX, ballY, radius, left, bottom)) return true;
      if (this.isPointonCircle(ballX, ballY, radius, right, top)) return true;
      if (this.isPointonCircle(ballX, ballY, radius, left, bottom)) return true;
    }

    return false;
  }

  private isPointonCircle(ballX, ballY, radius, pointX, pointY): boolean {
    const deltaX = ballX - pointX;
    const deltaY = ballY - pointY;
    const length = deltaX * deltaX + deltaY * deltaY;

    if (length > radius * radius) {
      return false;
    }
    return true;
  }

  public async updateGame() {
    this.incrementFrames();
    this.updatePaddle();
    if (this.isPause() === false) {
      this.calcNextBall();
      if (this.scored === true) {
        this.scored = false;
        this.round++;
        this.ballInit();
        this.paddleInit();
        this.setPauseTime(Math.random() * 2 + 1);
        //방 인원에게 점수 이벤트 전달
        this.info.SocketServer.in(`gameroom-${this.info.roomId}`).emit(
          InGameEvent.SCORE,
          {
            redScore: this.info.redScore,
            blueScore: this.info.blueScore,
          },
        );
        if (
          this.info.redScore >= this.info.winScore ||
          this.info.blueScore >= this.info.winScore
        ) {
          await this.info.eventEmitter.emitAsync(
            'gameroom:finish',
            this.info.roomId,
          );
          return;
        }
      }
    }
    //방 인원에게 게임 업데이트 이벤트 전달
    this.info.SocketServer.in(`gameroom-${this.info.roomId}`).emit(
      InGameEvent.UPDATE,
      this.state,
    );
  }

  /**
   * 정상 종료: 승점 달성
   * 비정상 종료: 플레이어 이탈
   */
  public finishGame(): InGameResultDto {
    clearInterval(this.intervalId);
    this.intervalId = null;
    //방 인원에게 게임 종료 이벤트 전달
    this.info.SocketServer.in(`gameroom-${this.info.roomId}`).emit(
      InGameEvent.FINISH,
      {
        redScore: this.info.redScore,
        blueScore: this.info.blueScore,
      },
    );
    //게임 전적 반환
    return {
      beginDate: this.info.beginDate,
      endDate: new Date(),
      redScore: this.info.redScore,
      blueScore: this.info.blueScore,
    };
  }

  public startGame() {
    this.intervalId = setInterval(
      this.updateGame.bind(this),
      1000 / this.info.fps,
    );
  }
}
