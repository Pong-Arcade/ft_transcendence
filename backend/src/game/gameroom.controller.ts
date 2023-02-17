import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { GameGateway } from './game.gateway';
import { GameRoomListResponseDto } from '../dto/response/gameroom.list.response.dto';
import { GameRoomStatus } from '../enum/gameroom.status.enum';
import { UserDto } from '../dto/user.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { GameRoomUsersInfoResponseDto } from 'src/dto/response/gameroom.users.info.response.dto';
import { User } from 'src/decorator/user.decorator';
import { GameRoomCreateRequestDto } from 'src/dto/request/gameroom.create.request.dto';
import { GameRoomInviteRequestDto } from 'src/dto/request/gameroom.invite.request.dto';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.auth.guard';
import { GameRoomService } from './gameroom.service';

@ApiTags('Game')
@UseGuards(JwtAuthGuard)
@Controller('api/game-rooms')
export class GameRoomController {
  private logger = new Logger(GameRoomController.name);

  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly gameRoomService: GameRoomService,
  ) {}

  @ApiOperation({
    summary: '전체 게임방 목록 조회',
    description: '전체 게임방 목록을 조회합니다.',
  })
  @ApiOkResponse({
    description: '전체 게임방 목록을 반환합니다.',
    type: GameRoomListResponseDto,
  })
  @Get()
  async getAllGameRooms(): Promise<GameRoomListResponseDto> {
    this.logger.log(`Called ${this.getAllGameRooms.name}`);
    return await this.gameRoomService.getAllGameRooms();
  }

  @ApiOperation({
    summary: '게임방 입장',
    description: '게임방에 입장합니다.',
  })
  @ApiCreatedResponse({
    description:
      '게임방 입장에 성공합니다. 해당 게임방에 속한 유저 정보를 반환합니다.',
    type: GameRoomUsersInfoResponseDto,
  })
  @ApiBadRequestResponse({
    description: '문법적인 오류가 있을 경우 게임방 입장에 실패합니다.',
  })
  @ApiNotFoundResponse({
    description:
      '존재하지 않는 게임방에 입장 시도한 경우 게임방 입장에 실패합니다.',
  })
  @ApiConflictResponse({
    description:
      '이미 게임방에 입장한 경우, 참여중인 게임방이 있는 경우, 게임방 정원이 가득찬 경우 게임방 입장에 실패합니다.',
  })
  @HttpCode(HttpStatus.CREATED)
  @Post('/join/:room_id')
  async joinGameRoom(
    @User() user: UserDto,
    @Param('room_id', ParseIntPipe) roomId: number,
  ): Promise<GameRoomUsersInfoResponseDto> {
    this.logger.log(`Called ${this.joinGameRoom.name}`);
    // 1. 해당 게임방 정보 확인
    const gameroomInfo = this.gameRoomService.getGameRoomInfo(roomId);
    if (!gameroomInfo) {
      throw new NotFoundException('존재하지 않는 채팅방입니다.');
    }
    // 2. 이미 게임방에 입장한 유저인지 확인
    // TODO:
    return new GameRoomUsersInfoResponseDto();
  }

  @ApiOperation({
    summary: '게임방 퇴장',
    description: '게임방에서 퇴장합니다. 방장이 나가는 경우 방이 삭제됩니다.',
  })
  @ApiNoContentResponse({
    description: '게임방 퇴장에 성공합니다.',
  })
  @ApiBadRequestResponse({
    description: '문법적인 오류가 있을 경우 게임방 퇴장에 실패합니다.',
  })
  @ApiNotFoundResponse({
    description:
      '존재하지 않는 게임방에 퇴장 시도하는 경우 게임방 퇴장에 실패합니다.',
  })
  @ApiConflictResponse({
    description:
      '해당 게임방에 입장하고 있지 않은 경우, 게임방 퇴장에 실패합니다.',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('/leave/:room_id')
  async leaveGameRoom(
    @User() user: UserDto,
    @Param('room_id', ParseIntPipe) roomId: number,
  ): Promise<void> {
    this.logger.log(`Called ${this.leaveGameRoom.name}`);
  }

  @ApiOperation({
    summary: '게임방 생성',
    description: '게임방을 생성합니다.',
  })
  @ApiCreatedResponse({
    description:
      '게임방 생성에 성공합니다. 게임방에 입장되며, 생성된 게임방의 유저 정보와 roomId를 반환합니다.',
    type: GameRoomUsersInfoResponseDto,
  })
  @HttpCode(HttpStatus.CREATED)
  @Post('/create')
  async createGameRoom(
    @User() user: UserDto,
    @Body(new ValidationPipe())
    gameRoomCreateRequestDto: GameRoomCreateRequestDto,
  ): Promise<GameRoomUsersInfoResponseDto> {
    this.logger.log(`Called ${this.createGameRoom.name}`);
    return new GameRoomUsersInfoResponseDto();
  }

  @ApiOperation({
    summary: '게임방에 초대',
    description: 'body에 담긴 유저들을 게임방에 초대합니다.',
  })
  @ApiCreatedResponse({
    description:
      '게임방에 초대에 성공합니다. 초대된 유저들에게 게임방에 초대되었다는 알림을 보냅니다.',
  })
  @ApiBadRequestResponse({
    description: '문법적인 오류가 있을 경우 게임방 초대에 실패합니다.',
  })
  @ApiForbiddenResponse({
    description: '게임방 방장이 아닌 경우, 게임방 초대에 실패합니다.',
  })
  @ApiNotFoundResponse({
    description: '존재하지 않는 게임방에 초대할 경우 게임방 초대에 실패합니다.',
  })
  @HttpCode(HttpStatus.CREATED)
  @Post('/invite/:room_id')
  async inviteGameRoom(
    @User() user: UserDto,
    @Param('room_id', ParseIntPipe) roomId: number,
    @Body(new ValidationPipe())
    gameRoomInviteRequestDto: GameRoomInviteRequestDto,
  ): Promise<void> {
    this.logger.log(`Called ${this.inviteGameRoom.name}`);
  }

  @ApiOperation({
    summary: '게임방 초대 수락',
    description: '게임방 초대를 수락합니다.',
  })
  @ApiCreatedResponse({
    description:
      '게임방 초대 수락에 성공합니다. 게임방에 입장되며, 해당 게임방에 속한 유저 정보를 반환합니다.',
    type: GameRoomUsersInfoResponseDto,
  })
  @ApiBadRequestResponse({
    description: '문법적인 오류가 있을 경우 게임방 초대 수락에 실패합니다.',
  })
  @ApiForbiddenResponse({
    description: '게임방 초대를 받지 않은 경우, 게임방 초대 수락에 실패합니다.',
  })
  @ApiNotFoundResponse({
    description:
      '존재하지 않는 게임방에 초대 수락할 경우 게임방 초대 수락에 실패합니다.',
  })
  @ApiConflictResponse({
    description:
      '이미 게임방에 입장한 경우, 참여중인 게임방이 있는 경우, 게임방 정원이 가득찬 경우 게임방 초대 수락에 실패합니다.',
  })
  @HttpCode(HttpStatus.CREATED)
  @Post('/invite/accept/:room_id')
  async acceptGameRoomInvite(
    @User() user: UserDto,
    @Param('room_id', ParseIntPipe) roomId: number,
  ): Promise<GameRoomUsersInfoResponseDto> {
    this.logger.log(`Called ${this.acceptGameRoomInvite.name}`);
    return new GameRoomUsersInfoResponseDto();
  }

  @ApiOperation({
    summary: '게임방 초대 거절',
    description: '게임방 초대를 거절합니다.',
  })
  @ApiNoContentResponse({
    description: '게임방 초대 거절에 성공합니다.',
  })
  @ApiBadRequestResponse({
    description: '문법적인 오류가 있을 경우 게임방 초대 거절에 실패합니다.',
  })
  @ApiForbiddenResponse({
    description: '게임방 초대를 받지 않은 경우, 게임방 초대 거절에 실패합니다.',
  })
  @ApiNotFoundResponse({
    description:
      '존재하지 않는 게임방에 초대 거절할 경우, 게임방 초대 거절에 실패합니다.',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('/invite/reject/:room_id')
  async rejectGameRoomInvite(
    @User() user: UserDto,
    @Param('room_id', ParseIntPipe) roomId: number,
  ): Promise<void> {
    this.logger.log(`Called ${this.rejectGameRoomInvite.name}`);
  }

  @ApiOperation({
    summary: '게임방 관전 입장',
    description:
      '게임방을 관전 입장합니다. 관전자는 게임 관전과 채팅만 가능합니다.',
  })
  @ApiCreatedResponse({
    description:
      '게임방 관전 입장에 성공합니다. 해당 게임방에 속한 유저 정보를 반환합니다.',
    type: GameRoomUsersInfoResponseDto,
  })
  @ApiBadRequestResponse({
    description: '문법적인 오류가 있을 경우 게임방 관전 입장에 실패합니다.',
  })
  @ApiNotFoundResponse({
    description:
      '존재하지 않는 게임방에 관전 입장 시도한 경우 게임방 관전 입장에 실패합니다.',
  })
  @ApiConflictResponse({
    description:
      '이미 관전 중인 경우, 참여중인 게임방이 있는 경우, 게임방 관전 정원이 가득찬 경우 게임방 관전 입장에 실패합니다.',
  })
  @HttpCode(HttpStatus.CREATED)
  @Post('/spectator/join/:room_id')
  async joinSpectateGameRoom(
    @User() user: UserDto,
    @Param('room_id', ParseIntPipe) roomId: number,
  ): Promise<GameRoomUsersInfoResponseDto> {
    this.logger.log(`Called ${this.joinSpectateGameRoom.name}`);
    return new GameRoomUsersInfoResponseDto();
  }

  @ApiOperation({
    summary: '게임방 관전 종료',
    description: '게임방 관전을 종료합니다.',
  })
  @ApiNoContentResponse({
    description: '게임방 관전 종료에 성공합니다.',
  })
  @ApiBadRequestResponse({
    description: '문법적인 오류가 있을 경우 게임방 관전 종료에 실패합니다.',
  })
  @ApiNotFoundResponse({
    description:
      '존재하지 않는 게임방에 관전 종료 시도한 경우 게임방 관전 종료에 실패합니다.',
  })
  @ApiConflictResponse({
    description: '관전자가 아닌 경우 게임방 관전 종료에 실패합니다.',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('/spectate/leave/:room_id')
  async leaveSpectateGameRoom(
    @User() user: UserDto,
    @Param('room_id', ParseIntPipe) roomId: number,
  ): Promise<void> {
    this.logger.log(`Called ${this.leaveSpectateGameRoom.name}`);
  }
}
