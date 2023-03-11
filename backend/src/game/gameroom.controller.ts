import {
  Body,
  ConflictException,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Logger,
  NotFoundException,
  Param,
  ParseEnumPipe,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { GameRoomListResponseDto } from '../dto/response/gameroom.list.response.dto';
import { UserDto } from '../dto/user.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { GameRoomUsersInfoResponseDto } from 'src/dto/response/gameroom.users.info.response.dto';
import { User } from 'src/decorator/user.decorator';
import { GameRoomCreateRequestDto } from 'src/dto/request/gameroom.create.request.dto';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.auth.guard';
import { GameRoomService } from './gameroom.service';
import { UserService } from 'src/user/user.service';
import { MatchType } from 'src/enum/match.type.enum';
import { StatusService } from 'src/status/status.service';
import { InGameConfigDto } from 'src/dto/ingame.config.dto';
import { GameInstance } from './gameInstance';

@ApiTags('Game')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/game-rooms')
export class GameRoomController {
  private logger = new Logger(GameRoomController.name);

  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly gameRoomService: GameRoomService,
    private readonly userService: UserService,
    @Inject('StatusService')
    private readonly statusService: StatusService,
  ) {}

  @ApiOperation({
    summary: '빠른 대전 신청',
    description:
      '빠른 대전을 큐에 입장 신청합니다. 노말과 래더를 선택할 수 있습니다.',
  })
  @ApiCreatedResponse({
    description: '빠른 대전 신청에 성공합니다.',
  })
  @ApiBadRequestResponse({
    description: '문법적인 오류가 있을 경우 빠른 대전 신청에 실패합니다.',
  })
  @ApiConflictResponse({
    description:
      '이미 빠른 대전 신청을 한 경우, 이미 게임방에 입장한 경우, 빠른 대전 신청에 실패합니다.',
  })
  @HttpCode(HttpStatus.CREATED)
  @Post('/join/quick-match/:match_type')
  async joinQuickMatchQueue(
    @User() user: UserDto,
    @Param('match_type', new ParseEnumPipe(MatchType)) matchType: MatchType,
  ): Promise<void> {
    this.logger.log(`Called ${this.joinQuickMatchQueue.name}`);
    // 1. 빠른 대전 신청을 한 유저인지 확인
    if (
      this.gameRoomService.isInLadderQuickMatchQueue(user.userId) ||
      this.gameRoomService.isInNormalQuickMatchQueue(user.userId)
    ) {
      throw new ConflictException('이미 빠른 대전 신청을 한 유저입니다.');
    }

    // 2. 게임방에 입장한 유저인지 확인
    if (this.gameRoomService.isOnGameRoom(user.userId)) {
      throw new ConflictException('이미 게임방에 입장한 유저입니다.');
    }

    // 3. 빠른 대전 신청 처리
    this.gameRoomService.joinQuickMatchQueue(user.userId, matchType);
  }

  @ApiOperation({
    summary: '빠른 대전 신청 취소',
    description: '빠른 대전 신청을 취소합니다.',
  })
  @ApiNoContentResponse({
    description: '빠른 대전 신청 취소에 성공합니다.',
  })
  @ApiBadRequestResponse({
    description: '문법적인 오류가 있을 경우 빠른 대전 신청 취소에 실패합니다.',
  })
  @ApiConflictResponse({
    description:
      '빠른 대전 신청을 하지 않은 경우, 빠른 대전 신청 취소에 실패합니다.',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('/leave/quick-match')
  async leaveQuickMatchQueue(@User() user: UserDto): Promise<void> {
    this.logger.log(`Called ${this.leaveQuickMatchQueue.name}`);
    // 1. 빠른 대전 신청을 한 유저인지 확인
    if (
      !this.gameRoomService.isInLadderQuickMatchQueue(user.userId) &&
      !this.gameRoomService.isInNormalQuickMatchQueue(user.userId)
    ) {
      throw new ConflictException('빠른 대전 신청을 하지 않은 유저입니다.');
    }

    // 2. 빠른 대전 신청 취소 처리
    this.gameRoomService.leaveQuickMatchQueue(user.userId);
  }

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
    summary: '게임 신청 수락',
    description: '게임 신청을 수락합니다. 초대받은 유저만 수락할 수 있습니다.',
  })
  @ApiCreatedResponse({
    description:
      '게임 신청 수락에 성공합니다. 게임방에 입장되며, 해당 게임방에 속한 유저 정보를 반환합니다.',
    type: GameRoomUsersInfoResponseDto,
  })
  @ApiBadRequestResponse({
    description: '문법적인 오류가 있을 경우 게임 신청 수락에 실패합니다.',
  })
  @ApiForbiddenResponse({
    description: '게임 신청을 받지 않은 경우, 게임 신청 수락에 실패합니다.',
  })
  @HttpCode(HttpStatus.CREATED)
  @Post('/invite/accept')
  async acceptGameRoomInvite(@User() user: UserDto): Promise<void> {
    this.logger.log(`Called ${this.acceptGameRoomInvite.name}`);
    // 1. 게임 신청을 받은 유저인지 확인
    if (!this.gameRoomService.isInvitee(user.userId)) {
      throw new ForbiddenException('게임 신청을 받지 않았습니다.');
    }

    // 2. 게임 신청 수락 처리
    this.eventEmitter.emit('gameroom:invite:accept', user.userId);
  }

  @ApiOperation({
    summary: '게임 신청 거절',
    description:
      '게임 신청을 거절합니다. 신청을 받은 유저만 게임 신청 거절을 할 수 있습니다.',
  })
  @ApiNoContentResponse({
    description: '게임 신청 거절에 성공합니다.',
  })
  @ApiBadRequestResponse({
    description: '문법적인 오류가 있을 경우 게임 신청 거절에 실패합니다.',
  })
  @ApiForbiddenResponse({
    description: '게임 신청 받지 않은 경우, 게임 신청 거절에 실패합니다.',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('/invite/reject')
  async rejectGameRoomInvite(@User() user: UserDto): Promise<void> {
    this.logger.log(`Called ${this.rejectGameRoomInvite.name}`);

    // 2. 게임 신청을 받은 유저인지 확인
    if (!this.gameRoomService.isInvitee(user.userId)) {
      throw new ForbiddenException('게임 신청을 받지 않았습니다.');
    }

    // 3. 게임 신청 거절
    this.eventEmitter.emit('gameroom:invite:reject', user.userId);
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
    if (
      this.gameRoomService.isOnThatGameRoom(gameroomInfo.roomId, user.userId)
    ) {
      throw new ConflictException('이미 입장한 게임방입니다.');
    }

    // 3. 참여중인 게임방이 있는지 확인
    if (this.gameRoomService.isOnGameRoom(user.userId)) {
      throw new ConflictException('참여중인 게임방이 있습니다.');
    }

    // 4. 게임방 정원 확인
    if (this.gameRoomService.getGameRoomUserCount(roomId) == 2) {
      throw new ConflictException('게임방 정원이 가득 찼습니다.');
    }

    // 5. 게임방 입장
    this.eventEmitter.emit('gameroom:join', roomId, user);

    // 6. 게임방에 입장한 유저 정보 반환
    return await this.gameRoomService.getGameRoomUsersInfo(gameroomInfo);
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
    // 1. 해당 게임방 정보 확인
    const gameroomInfo = this.gameRoomService.getGameRoomInfo(roomId);
    if (!gameroomInfo) {
      throw new NotFoundException('존재하지 않는 게임방입니다.');
    }

    // 2. 해당 게임방에 입장한 유저인지 확인
    if (
      !this.gameRoomService.isOnThatGameRoom(gameroomInfo.roomId, user.userId)
    ) {
      return;
    }

    // 3. 게임방 퇴장
    this.eventEmitter.emit('gameroom:leave', roomId, user.userId);
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
    // 1. 참여중인 게임방이 있는지 확인
    if (this.gameRoomService.isOnGameRoom(user.userId)) {
      throw new ConflictException('참여중인 게임방이 있습니다.');
    }

    // 2. 게임방 생성
    await this.eventEmitter.emitAsync(
      'gameroom:create',
      user,
      gameRoomCreateRequestDto,
    );

    // 3. 자신이 생성한 게임방의 roomId를 반환
    const roomId = this.gameRoomService.getMyMasterGameRoomId(user.userId);

    // 4. 게임방에 입장
    this.eventEmitter.emit('gameroom:join', roomId, user);

    // 5. 게임방에 입장한 유저 정보 반환
    return await this.gameRoomService.getGameRoomUsersInfo(
      this.gameRoomService.getGameRoomInfo(roomId),
    );
  }

  @ApiOperation({
    summary: '게임 신청',
    description: '특정 유저에게 게임을 신청합니다.',
  })
  @ApiCreatedResponse({
    description:
      '게임 신청에 성공합니다. 신청을 받은 유저에게는 게임 신청을 받았다는 알림을 보냅니다.',
  })
  @ApiBadRequestResponse({
    description: '문법적인 오류가 있을 경우 게임 신청에 실패합니다.',
  })
  @ApiNotFoundResponse({
    description: '존재하지 않는 유저에게 신청한 경우, 게임 신청에 실패합니다.',
  })
  @ApiConflictResponse({
    description:
      '오프라인 유저에게 신청한 경우, 게임방에 이미 입장한 유저에게 신청한 경우, 자신이나 상대방이 이미 수락 대기중인 상태인 경우, 게임 신청에 실패합니다.',
  })
  @HttpCode(HttpStatus.CREATED)
  @Post('/invite/:target_user_id')
  async inviteGame(
    @User() user: UserDto,
    @Param('target_user_id', ParseIntPipe) targetUserId: number,
  ): Promise<void> {
    this.logger.log(`Called ${this.inviteGame.name}`);

    // 1. 해당 유저가 존재하는지 확인
    const targetUser = await this.userService.getUserInfo(targetUserId);
    if (!targetUser) {
      throw new NotFoundException('존재하지 않는 유저입니다.');
    }

    // 2. 오프라인 유저에게 신청한 경우
    if (!this.statusService.isOnline(targetUserId)) {
      throw new ConflictException('오프라인 유저에게는 신청할 수 없습니다.');
    }

    // 3. 게임방에 이미 입장한 유저에게 신청한 경우
    if (this.gameRoomService.isOnGameRoom(targetUserId)) {
      throw new ConflictException(
        '게임방에 이미 입장한 유저에게는 신청할 수 없습니다.',
      );
    }

    // 4. 자신이나 상대방이 수락 대기중인 상태인 경우
    if (
      this.gameRoomService.isInviter(user.userId) ||
      this.gameRoomService.isInvitee(targetUserId)
    ) {
      throw new ConflictException(
        '이미 신청 수락 대기중인 상태에서는 신청할 수 없습니다.',
      );
    }

    // 5. 게임 신청 요청 처리
    this.eventEmitter.emit(
      'gameroom:invite',
      user.userId,
      targetUserId,
      MatchType.NORMAL, // kangkim 수정
    );
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
      '이미 해당 게임방에 입장한 경우, 참여중인 게임방이 있는 경우, 게임방 관전 정원이 가득찬 경우 게임방 관전 입장에 실패합니다.',
  })
  @HttpCode(HttpStatus.CREATED)
  @Post('/spectator/join/:room_id')
  async joinSpectateGameRoom(
    @User() user: UserDto,
    @Param('room_id', ParseIntPipe) roomId: number,
  ): Promise<GameRoomUsersInfoResponseDto> {
    this.logger.log(`Called ${this.joinSpectateGameRoom.name}`);
    // 1. 해당 게임방 정보 확인
    const gameroomInfo = this.gameRoomService.getGameRoomInfo(roomId);
    if (!gameroomInfo) {
      throw new NotFoundException('존재하지 않는 게임방입니다.');
    }

    // 2. 이미 해당 게임방에 입장한 유저인지 확인
    if (this.gameRoomService.isOnThatGameRoom(roomId, user.userId)) {
      throw new ConflictException('이미 해당 게임방에 입장했습니다.');
    }

    // 3. 참여중인 게임방이 있는지 확인
    if (this.gameRoomService.isOnGameRoom(user.userId)) {
      throw new ConflictException('참여중인 게임방이 있습니다.');
    }

    // 4. 게임방 관전 정원이 가득찼는지 확인
    if (gameroomInfo.spectatorUsers.length === gameroomInfo.maxSpectatorCount) {
      throw new ConflictException('게임방 관전 정원이 가득찼습니다.');
    }

    // 5. 게임방 관전 입장
    this.eventEmitter.emit('gameroom:spectator:join', roomId, user.userId);

    // 6. 게임방에 입장한 유저 정보 반환
    return await this.gameRoomService.getGameRoomUsersInfo(gameroomInfo);
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
    // 1. 해당 게임방 정보 확인
    const gameroomInfo = this.gameRoomService.getGameRoomInfo(roomId);
    if (!gameroomInfo) {
      throw new NotFoundException('존재하지 않는 게임방입니다.');
    }

    // 2. 관전자로 입장한 유저인지 확인
    if (!gameroomInfo.spectatorUsers.includes(user.userId)) {
      return;
    }

    // 3. 게임방 관전 종료
    this.eventEmitter.emit('gameroom:spectator:leave', roomId, user.userId);
  }

  @ApiOperation({
    summary: '게임 준비',
    description: '게임 준비 요청을 합니다.',
  })
  @ApiOkResponse({
    description: '게임 준비 요청에 성공합니다.',
  })
  @ApiBadRequestResponse({
    description: '문법적인 오류가 있을 경우 게임 준비 요청에 실패합니다.',
  })
  @ApiNotFoundResponse({
    description:
      '존재하지 않는 게임방에 게임 준비 요청 시도한 경우 게임 준비 요청에 실패합니다.',
  })
  @ApiConflictResponse({
    description:
      '게임방에 입장하지 않은 유저나 관전자가 게임 준비 요청 시도한 경우, 게임 준비 요청에 실패합니다.',
  })
  @HttpCode(HttpStatus.OK)
  @Patch('/ready/:room_id')
  async readyGameRoom(
    @User() user: UserDto,
    @Param('room_id', ParseIntPipe) roomId: number,
  ): Promise<void> {
    this.logger.log(`Called ${this.readyGameRoom.name}`);
    // 1. 해당 게임방 정보 확인
    const gameroomInfo = this.gameRoomService.getGameRoomInfo(roomId);
    if (!gameroomInfo) {
      throw new NotFoundException('존재하지 않는 게임방입니다.');
    }

    // 2. 게임방에 입장한 유저인지 확인
    if (!this.gameRoomService.isOnThatGameRoom(roomId, user.userId)) {
      throw new ConflictException('게임방에 입장하지 않았습니다.');
    }

    // 3. 관전자가 아닌지 확인
    if (gameroomInfo.spectatorUsers.includes(user.userId)) {
      throw new ConflictException('관전자는 게임 준비 요청을 할 수 없습니다.');
    }

    // 4. 게임 준비 요청
    this.eventEmitter.emit('gameroom:ready', roomId, user.userId);
  }

  @ApiOperation({
    summary: '게임 준비 취소',
    description: '게임 준비 취소 요청을 합니다.',
  })
  @ApiOkResponse({
    description: '게임 준비 취소 요청에 성공합니다.',
  })
  @ApiBadRequestResponse({
    description: '문법적인 오류가 있을 경우 게임 준비 취소 요청에 실패합니다.',
  })
  @ApiNotFoundResponse({
    description:
      '존재하지 않는 게임방에 게임 준비 취소 요청 시도한 경우 게임 준비 취소 요청에 실패합니다.',
  })
  @ApiConflictResponse({
    description:
      '게임방에 입장하지 않은 유저나 관전자가 게임 준비 취소 요청 시도한 경우, 게임 준비 취소 요청에 실패합니다.',
  })
  @HttpCode(HttpStatus.OK)
  @Patch('/unready/:room_id')
  async unReadyGameRoom(
    @User() user: UserDto,
    @Param('room_id', ParseIntPipe) roomId: number,
  ): Promise<void> {
    this.logger.log(`Called ${this.unReadyGameRoom.name}`);
    // 1. 해당 게임방 정보 확인
    const gameroomInfo = this.gameRoomService.getGameRoomInfo(roomId);
    if (!gameroomInfo) {
      throw new NotFoundException('존재하지 않는 게임방입니다.');
    }

    // 2. 게임방에 입장한 유저인지 확인
    if (!this.gameRoomService.isOnThatGameRoom(roomId, user.userId)) {
      throw new ConflictException('게임방에 입장하지 않았습니다.');
    }

    // 3. 관전자가 아닌지 확인
    if (gameroomInfo.spectatorUsers.includes(user.userId)) {
      throw new ConflictException(
        '관전자는 게임 준비 취소 요청을 할 수 없습니다.',
      );
    }

    // 4. 게임 준비 취소 요청
    this.eventEmitter.emit('gameroom:unready', roomId, user.userId);
  }

  @ApiOperation({
    summary: '게임룸 캔버스 설정 요소 요청',
    description: 'canvas에 그릴 요소 정보를 요청합니다.',
  })
  @Get('/config')
  async getGameRoomConfig(): Promise<InGameConfigDto> {
    this.logger.log(`Called ${this.getGameRoomConfig.name}`);
    return GameInstance.makeSetConfig();
  }
}
