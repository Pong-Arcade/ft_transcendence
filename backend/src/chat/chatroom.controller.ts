import {
  Body,
  ConflictException,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  NotFoundException,
  Param,
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
import { ChatRoomListResponseDto } from 'src/dto/response/chatroom.list.response.dto';
import { ChatroomUsersInfoResponseDto } from 'src/dto/response/chatroom.users.info.response.dto';
import { User } from 'src/decorator/user.decorator';
import { UserDto } from 'src/dto/user.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ChatRoomMode } from 'src/enum/chatroom.mode.enum';
import { rooms } from './chat.geteway';
import { ChatroomCreateRequestDto } from 'src/dto/request/chatroom.create.request.dto';
import { ChatroomInviteRequestDto } from 'src/dto/request/chatroom.invite.request.dto';
import { ChangeChatroomInfoRequestDto } from 'src/dto/request/chatroom.change.info.request.dto';
import { ChatroomCreateUsersInfoResponseDto } from 'src/dto/response/chatroom.create.users.info.response.dto';
import { ChatroomService } from './chat.service';
import { UserChatMode } from 'src/enum/user.chat.mode.enum';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.auth.guard';
import { MockRepository } from 'src/mock/mock.repository';

@ApiTags('Chat')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/chat-rooms')
export class ChatroomController {
  private logger = new Logger(ChatroomController.name);
  private mock = new MockRepository();

  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly chatroomService: ChatroomService,
  ) {}

  @ApiOperation({
    summary: '전체 채팅방 목록 조회',
    description: '전체 채팅방 목록을 조회합니다.',
  })
  @ApiOkResponse({
    description: '전체 채팅방 목록을 반환합니다.',
    type: ChatRoomListResponseDto,
  })
  @Get()
  getAllChatrooms(): ChatRoomListResponseDto {
    this.logger.log(`Called ${this.getAllChatrooms.name}`);

    return this.chatroomService.getAllChatrooms();
  }

  @ApiOperation({
    summary: '채팅방 입장',
    description: '채팅방에 입장합니다.',
  })
  @ApiCreatedResponse({
    description:
      '채팅방 입장에 성공합니다. 해당 채팅방에 속한 유저 정보를 반환합니다.',
    type: ChatroomUsersInfoResponseDto,
  })
  @ApiBadRequestResponse({
    description: '문법적인 오류가 있을 경우 채팅방 입장에 실패합니다.',
  })
  @ApiForbiddenResponse({
    description:
      '비밀번호가 걸린 채팅방에 입장할 때 비밀번호가 일치하지 않을 경우, 추방당한 채팅방에 입장 시도한 경우 채팅방 입장에 실패합니다.',
  })
  @ApiNotFoundResponse({
    description:
      '존재하지 않는 채팅방에 입장 시도한 경우 채팅방 입장에 실패합니다.',
  })
  @ApiConflictResponse({
    description:
      '이미 채팅방에 입장한 경우, 참여중인 채팅방이 있는 경우(로비 채팅방 제외), 채팅방 정원이 가득찬 경우 채팅방 입장에 실패합니다.',
  })
  @HttpCode(HttpStatus.CREATED)
  @Post('/join/:room_id')
  async joinChatroom(
    @User() user: UserDto,
    @Param('room_id', ParseIntPipe) roomId: number,
    @Body('password') password?: string,
  ): Promise<ChatroomUsersInfoResponseDto> {
    this.logger.log(`Called ${this.joinChatroom.name}`);
    // 1. 해당 채팅방 정보 확인
    const chatroomInfo = this.chatroomService.getChatroomInfo(roomId);
    if (!chatroomInfo) {
      throw new NotFoundException('존재하지 않는 채팅방입니다.');
    }

    // 2. 이미 채팅방에 입장한 유저인지 확인
    if (chatroomInfo.users.includes(user.userId)) {
      throw new ConflictException('이미 채팅방에 참여중입니다.');
    }

    // 3. 참여중인 채팅방이 있는지 확인
    for (const room of rooms.values()) {
      if (room.users.includes(user.userId)) {
        throw new ConflictException('참여중인 채팅방이 있습니다.');
      }
    }

    // 4. 채팅방 정원이 가득 찼는지 확인
    if (chatroomInfo.users.length >= chatroomInfo.maxUser) {
      throw new ConflictException('채팅방 정원이 가득 찼습니다.');
    }

    // 5. 추방당한 유저인지 확인
    if (chatroomInfo.bannedUsers.includes(user.userId)) {
      throw new ForbiddenException('추방당한 방에 참여할 수 없습니다.');
    }

    // 6. 비밀번호 채팅방인 경우, 비밀번호가 일치하는지 확인
    if (chatroomInfo.mode === ChatRoomMode.PROTECTED) {
      // FIXME: bcrypt로 암호화된 비밀번호와 비교
      if (chatroomInfo.password !== password) {
        throw new ForbiddenException('비밀번호가 일치하지 않습니다.');
      }
    }

    if (chatroomInfo.mode === ChatRoomMode.PRIVATE) {
      throw new ForbiddenException('초대된 유저만 입장할 수 있습니다.');
    }

    // 7. 채팅방에 입장
    this.eventEmitter.emit('chatroom:join', roomId, user.userId);

    // 8. 채팅방에 입장한 유저 정보 반환
    return await this.chatroomService.getChatroomUsersInfo(chatroomInfo);
  }

  @ApiOperation({
    summary: '채팅방 퇴장',
    description: '채팅방에서 퇴장합니다. 방장이 나가는 경우 방이 삭제됩니다.',
  })
  @ApiNoContentResponse({
    description: '채팅방 퇴장에 성공합니다.',
  })
  @ApiBadRequestResponse({
    description: '문법적인 오류가 있을 경우 채팅방 퇴장에 실패합니다.',
  })
  @ApiNotFoundResponse({
    description:
      '존재하지 않는 채팅방에 퇴장 시도하는 경우 채팅방 퇴장에 실패합니다.',
  })
  @ApiConflictResponse({
    description:
      '해당 채팅방에 입장하고 있지 않은 경우, 채팅방 퇴장에 실패합니다.',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('/leave/:room_id')
  async leaveChatroom(
    @User() user: UserDto,
    @Param('room_id', ParseIntPipe) roomId: number,
  ): Promise<void> {
    this.logger.log(`Called ${this.leaveChatroom.name}`);
    // 1. 해당 채팅방 정보 확인
    const chatroomInfo = this.chatroomService.getChatroomInfo(roomId);
    if (!chatroomInfo) {
      throw new NotFoundException('존재하지 않는 채팅방입니다.');
    }

    // 2. 해당 채팅방에 입장중인 유저인지 확인
    if (!chatroomInfo.users.includes(user.userId)) {
      throw new ConflictException('해당 채팅방에 참여중이지 않습니다.');
    }

    // 3. 채팅방 퇴장
    this.eventEmitter.emit('chatroom:leave', roomId, user.userId);
  }

  @ApiOperation({
    summary: '채팅방 생성',
    description: '채팅방을 생성합니다.',
  })
  @ApiConflictResponse({
    description:
      '참여중인 채팅방이 있는 경우(로비 채팅방 제외), 채팅방 생성에 실패합니다.',
  })
  @ApiCreatedResponse({
    description:
      '채팅방 생성에 성공합니다. 채팅방에 입장되며, 생성된 채팅방의 유저 정보와 roomId를 반환합니다.',
    type: ChatroomCreateUsersInfoResponseDto,
  })
  @HttpCode(HttpStatus.CREATED)
  @Post('/create')
  async createChatroom(
    @User() user: UserDto,
    @Body(new ValidationPipe())
    chatroomCreateRequestDto: ChatroomCreateRequestDto,
  ): Promise<ChatroomCreateUsersInfoResponseDto> {
    this.logger.log(`Called ${this.createChatroom.name}`);

    // 1. 참여중인 채팅방이 있는지 확인
    for (const room of rooms.values()) {
      if (room.users.includes(user.userId)) {
        throw new ConflictException('참여중인 채팅방이 있습니다.');
      }
    }

    // 2. 채팅방 생성
    this.eventEmitter.emit(
      'chatroom:create',
      user.userId,
      chatroomCreateRequestDto,
    );

    // 3. 자신이 생성한 채팅방의 roomId를 가져온다.
    const roomId = this.chatroomService.getMyMasterChatroomId(user.userId);

    // 4. 채팅방에 입장한 유저 정보 반환(roomId 포함)
    return await this.chatroomService.getChatroomCreateUsersInfo(roomId);
  }

  @ApiOperation({
    summary: '채팅방에 초대',
    description: 'body에 담긴 유저들을 채팅방에 초대합니다.',
  })
  @ApiCreatedResponse({
    description:
      '채팅방에 초대에 성공합니다. 초대된 유저들에게 채팅방에 초대되었다는 알림을 보냅니다.',
  })
  @ApiBadRequestResponse({
    description: '문법적인 오류가 있을 경우 채팅방 초대에 실패합니다.',
  })
  @ApiForbiddenResponse({
    description: '채팅방 관리자가 아닌 경우, 채팅방 초대에 실패합니다.',
  })
  @ApiNotFoundResponse({
    description: '존재하지 않는 채팅방에 초대할 경우 채팅방 초대에 실패합니다.',
  })
  @HttpCode(HttpStatus.CREATED)
  @Post('/invite/:room_id')
  async inviteChatroom(
    @User() user: UserDto,
    @Param('room_id', ParseIntPipe) roomId: number,
    @Body(new ValidationPipe())
    chatroomInviteRequestDto: ChatroomInviteRequestDto,
  ): Promise<void> {
    this.logger.log(`Called ${this.inviteChatroom.name}`);

    // 1. 해당 채팅방 정보 확인
    const chatroomInfo = this.chatroomService.getChatroomInfo(roomId);
    if (!chatroomInfo) {
      throw new NotFoundException('존재하지 않는 채팅방입니다.');
    }

    // 2. 해당 채팅방 관리자인지 확인
    const userChatMode = this.chatroomService.getChatroomUserMode(
      chatroomInfo,
      user.userId,
    );
    if (userChatMode === UserChatMode.NORMAL) {
      throw new ForbiddenException('채팅방 관리자만 초대할 수 있습니다');
    }

    // 3. 채팅방 초대

    const allowedUsers = chatroomInviteRequestDto.users.filter(
      (userId) => !chatroomInfo.bannedUsers.includes(userId),
    );
    const bannedUsers = chatroomInviteRequestDto.users.filter((userId) =>
      chatroomInfo.bannedUsers.includes(userId),
    );

    //  마스터가 아니라면 밴 당하지 않은 사람 초대
    this.eventEmitter.emit(
      'chatroom:invite',
      roomId,
      user.userId,
      allowedUsers,
    );

    //  마스터라면 밴 당한 사람도 초대해줌
    if (userChatMode === UserChatMode.MASTER) {
      this.eventEmitter.emit(
        'chatroom:invite',
        roomId,
        user.userId,
        bannedUsers,
      );
    }
  }

  @ApiOperation({
    summary: '채팅방 초대 수락',
    description: '채팅방 초대를 수락합니다.',
  })
  @ApiCreatedResponse({
    description:
      '채팅방 초대 수락에 성공합니다. 채팅방에 입장되며, 해당 채팅방에 속한 유저 정보를 반환합니다.',
    type: ChatroomUsersInfoResponseDto,
  })
  @ApiBadRequestResponse({
    description: '문법적인 오류가 있을 경우 채팅방 초대 수락에 실패합니다.',
  })
  @ApiForbiddenResponse({
    description:
      '채팅방 초대를 받지 않은 경우, 추방당한 채팅방인 경우, 채팅방 초대 수락에 실패합니다.',
  })
  @ApiNotFoundResponse({
    description:
      '존재하지 않는 채팅방에 초대 수락할 경우 채팅방 초대 수락에 실패합니다.',
  })
  @ApiConflictResponse({
    description:
      '이미 채팅방에 입장한 경우, 참여중인 채팅방이 있는 경우(로비 채팅방 제외), 채팅방 정원이 가득찬 경우 채팅방 초대 수락에 실패합니다.',
  })
  @HttpCode(HttpStatus.CREATED)
  @Post('/invite/accept/:room_id')
  async acceptChatroomInvite(
    @User() user: UserDto,
    @Param('room_id', ParseIntPipe) roomId: number,
  ): Promise<ChatroomUsersInfoResponseDto> {
    this.logger.log(`Called ${this.acceptChatroomInvite.name}`);
    // 1. 해당 채팅방 정보 확인
    const chatroomInfo = this.chatroomService.getChatroomInfo(roomId);
    if (!chatroomInfo) {
      throw new NotFoundException('존재하지 않는 채팅방입니다.');
    }

    // 2. 해당 채팅방에 초대된 유저인지 확인
    if (!chatroomInfo.invitedUsers.includes(user.userId)) {
      throw new ForbiddenException('해당 채팅방에 초대 받지 않았습니다.');
    }

    // 3. 이미 채팅방에 입장한 유저인지 확인
    if (chatroomInfo.users.includes(user.userId)) {
      throw new ConflictException('이미 채팅방에 참여중입니다.');
    }

    // 4. 참여중인 채팅방이 있는지 확인
    for (const room of rooms.values()) {
      if (room.users.includes(user.userId)) {
        throw new ConflictException('참여중인 채팅방이 있습니다.');
      }
    }

    // 5. 채팅방 정원이 가득 찼는지 확인
    if (chatroomInfo.users.length >= chatroomInfo.maxUser) {
      throw new ConflictException('채팅방 정원이 가득 찼습니다.');
    }

    // 6. 채팅방에 입장
    this.eventEmitter.emit('chatroom:join', roomId, user.userId);

    // 7. 채팅방에 속한 유저 정보 반환
    return await this.chatroomService.getChatroomUsersInfo(chatroomInfo);
  }

  @ApiOperation({
    summary: '채팅방 초대 거절',
    description: '채팅방 초대를 거절합니다.',
  })
  @ApiNoContentResponse({
    description: '채팅방 초대 거절에 성공합니다.',
  })
  @ApiBadRequestResponse({
    description: '문법적인 오류가 있을 경우 채팅방 초대 거절에 실패합니다.',
  })
  @ApiForbiddenResponse({
    description: '채팅방 초대를 받지 않은 경우, 채팅방 초대 거절에 실패합니다.',
  })
  @ApiNotFoundResponse({
    description:
      '존재하지 않는 채팅방에 초대 거절할 경우, 채팅방 초대 거절에 실패합니다.',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('/invite/reject/:room_id')
  async rejectChatroomInvite(
    @User() user: UserDto,
    @Param('room_id', ParseIntPipe) roomId: number,
  ): Promise<void> {
    this.logger.log(`Called ${this.rejectChatroomInvite.name}`);

    // 1. 해당 채팅방 정보 확인
    const chatroomInfo = this.chatroomService.getChatroomInfo(roomId);
    if (!chatroomInfo) {
      throw new NotFoundException('존재하지 않는 채팅방입니다.');
    }

    // 2. 해당 채팅방에 초대된 유저인지 확인
    if (!chatroomInfo.invitedUsers.includes(user.userId)) {
      throw new ForbiddenException('채팅방 초대를 받지 않았습니다.');
    }

    // 3. 채팅방 초대 거절
    this.eventEmitter.emit('chatroom:invite:reject', roomId, user.userId);
  }

  @ApiOperation({
    summary: '채팅방에서 추방',
    description: '해당 유저를 채팅방에서 추방합니다.',
  })
  @ApiNoContentResponse({
    description:
      '채팅방에서 추방하는데 성공합니다. 해당 유저는 다시 채팅방에 입장할 수 없습니다.',
  })
  @ApiBadRequestResponse({
    description: '문법적인 오류가 있을 경우 채팅방에서 추방에 실패합니다.',
  })
  @ApiForbiddenResponse({
    description:
      '채팅방 관리자가 아닌 경우, 자신 이상의 등급의 관리자를 추방 시도하는 경우, 채팅방에서 추방에 실패합니다.',
  })
  @ApiNotFoundResponse({
    description:
      '채팅방 ID나 유저 ID가 존재하지 않는 경우, 채팅방에서 추방에 실패합니다.',
  })
  @ApiConflictResponse({
    description:
      '이미 채팅방에서 추방된 유저를 추방 시도하는 경우, 채팅방에서 추방에 실패합니다.',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('/ban/:room_id/:target_user_id')
  async banUserFromChatroom(
    @User() user: UserDto,
    @Param('room_id', ParseIntPipe) roomId: number,
    @Param('target_user_id', ParseIntPipe) targetUserId: number,
  ): Promise<void> {
    this.logger.log(`Called ${this.banUserFromChatroom.name}`);

    // 1. 해당 채팅방 정보 확인
    const chatroomInfo = this.chatroomService.getChatroomInfo(roomId);
    if (!chatroomInfo) {
      throw new NotFoundException('존재하지 않는 채팅방입니다.');
    }

    // 2. 존재하지 않는 유저인지 확인
    if (!chatroomInfo.users.includes(targetUserId)) {
      throw new NotFoundException('채팅방에 존재하지 않는 유저입니다.');
    }

    // 3. 해당 채팅방 관리자인지 확인
    const userChatMode = this.chatroomService.getChatroomUserMode(
      chatroomInfo,
      user.userId,
    );
    if (userChatMode === UserChatMode.NORMAL) {
      throw new ForbiddenException('채팅방 관리자가 아닙니다.');
    }

    // 4. 자신 이상의 등급의 관리자를 추방 시도하는지 확인
    const targetUserChatMode = this.chatroomService.getChatroomUserMode(
      chatroomInfo,
      targetUserId,
    );
    if (
      !this.chatroomService.isHigherChatMode(userChatMode, targetUserChatMode)
    ) {
      throw new ForbiddenException(
        '자신 이상의 등급의 관리자를 추방할 수 없습니다.',
      );
    }

    // 5. 이미 채팅방에서 추방된 유저인지 확인
    if (chatroomInfo.bannedUsers.includes(targetUserId)) {
      throw new ConflictException('이미 채팅방에서 추방된 유저입니다.');
    }

    // 6. 채팅방에서 추방
    this.eventEmitter.emit('chatroom:ban', roomId, targetUserId);
  }

  @ApiOperation({
    summary: '채팅방에서 추방 해제',
    description: '해당 유저를 채팅방에서 추방 해제합니다.',
  })
  @ApiNoContentResponse({
    description: '채팅방에서 추방 해제하는데 성공합니다.',
  })
  @ApiBadRequestResponse({
    description: '문법적인 오류가 있을 경우 채팅방에서 추방 해제에 실패합니다.',
  })
  @ApiForbiddenResponse({
    description:
      '채팅방 관리자가 아닌 경우, 채팅방에서 추방 해제에 실패합니다.',
  })
  @ApiNotFoundResponse({
    description:
      '채팅방 ID가 존재하지 않는 경우, 채팅방에서 추방 해제에 실패합니다.',
  })
  @ApiConflictResponse({
    description:
      '채팅방에서 추방되지 않은 유저를 추방 해제 시도하는 경우, 채팅방에서 추방 해제에 실패합니다.',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('/unban/:room_id/:target_user_id')
  async unbanUserFromChatroom(
    @User() user: UserDto,
    @Param('room_id', ParseIntPipe) roomId: number,
    @Param('target_user_id', ParseIntPipe) targetUserId: number,
  ): Promise<void> {
    this.logger.log(`Called ${this.unbanUserFromChatroom.name}`);

    // 1. 해당 채팅방 정보 확인
    const chatroomInfo = this.chatroomService.getChatroomInfo(roomId);
    if (!chatroomInfo) {
      throw new NotFoundException('존재하지 않는 채팅방입니다.');
    }

    // 2. 해당 채팅방 관리자인지 확인
    const userChatMode = this.chatroomService.getChatroomUserMode(
      chatroomInfo,
      user.userId,
    );
    if (userChatMode === UserChatMode.NORMAL) {
      throw new ForbiddenException('채팅방 관리자가 아닙니다.');
    }

    // 3. 자신 이상의 등급의 관리자를 추방 시도하는지 확인
    const targetUserChatMode = this.chatroomService.getChatroomUserMode(
      chatroomInfo,
      targetUserId,
    );
    if (
      !this.chatroomService.isHigherChatMode(userChatMode, targetUserChatMode)
    ) {
      throw new ForbiddenException(
        '자신 이상의 등급의 관리자를 추방할 수 없습니다.',
      );
    }

    // 4. 채팅방에서 추방되지 않은 유저인지 확인
    if (!chatroomInfo.bannedUsers.includes(targetUserId)) {
      throw new ConflictException('채팅방에서 추방되지 않은 유저입니다.');
    }

    // 5. 채팅방에서 추방 해제
    this.eventEmitter.emit('chatroom:unban', roomId, targetUserId);
  }

  @ApiOperation({
    summary: '관리자 임명',
    description: '해당 유저를 채팅방 관리자로 임명합니다.',
  })
  @ApiOkResponse({
    description: '해당 유저를 채팅방 관리자로 임명하는데 성공합니다.',
  })
  @ApiBadRequestResponse({
    description: '문법적인 오류가 있을 경우 관리자 임명에 실패합니다.',
  })
  @ApiForbiddenResponse({
    description: '채팅방 방장이 아닌 경우, 관리자 임명에 실패합니다.',
  })
  @ApiNotFoundResponse({
    description:
      '채팅방 ID나 유저 ID가 존재하지 않는 경우, 관리자 임명에 실패합니다.',
  })
  @ApiConflictResponse({
    description:
      '이미 채팅방 관리자인 유저를 관리자 임명 시도하는 경우, 자기 자신을 관리자로 임명하려는 경우, 관리자 임명에 실패합니다.',
  })
  @HttpCode(HttpStatus.OK)
  @Patch('/promote-admin/:room_id/:target_user_id')
  async promoteUserToAdmin(
    @User() user: UserDto,
    @Param('room_id', ParseIntPipe) roomId: number,
    @Param('target_user_id', ParseIntPipe) targetUserId: number,
  ): Promise<void> {
    this.logger.log(`Called ${this.promoteUserToAdmin.name}`);

    // 1. 해당 채팅방 정보 확인
    const chatroomInfo = this.chatroomService.getChatroomInfo(roomId);
    if (!chatroomInfo) {
      throw new NotFoundException('존재하지 않는 채팅방입니다.');
    }

    // 2. 존재하지 않는 유저인지 확인
    if (!chatroomInfo.users.includes(targetUserId)) {
      throw new NotFoundException('채팅방에 존재하지 않는 유저입니다.');
    }

    // 3. 해당 채팅방 방장인지 확인
    const userChatMode = this.chatroomService.getChatroomUserMode(
      chatroomInfo,
      user.userId,
    );
    if (userChatMode !== UserChatMode.MASTER) {
      throw new ForbiddenException(
        '채팅방 방장만 관리자를 임명할 수 있습니다.',
      );
    }

    // 4. 자기 자신을 관리자로 임명하는지 확인
    if (user.userId === targetUserId) {
      throw new ConflictException('자기 자신을 관리자로 임명할 수 없습니다.');
    }

    // 5. 이미 채팅방 관리자인지 확인
    const targetUserChatMode = this.chatroomService.getChatroomUserMode(
      chatroomInfo,
      targetUserId,
    );
    if (targetUserChatMode !== UserChatMode.NORMAL) {
      throw new ConflictException('해당 유저는 이미 채팅방 관리자입니다.');
    }

    // 6. 채팅방 관리자로 임명
    this.eventEmitter.emit('chatroom:promote-admin', roomId, targetUserId);
  }

  @ApiOperation({
    summary: '관리자 해임',
    description: '해당 유저를 채팅방 관리자에서 해임합니다.',
  })
  @ApiOkResponse({
    description: '해당 유저를 채팅방 관리자에서 해임하는데 성공합니다.',
  })
  @ApiBadRequestResponse({
    description: '문법적인 오류가 있을 경우 관리자 해임에 실패합니다.',
  })
  @ApiForbiddenResponse({
    description: '채팅방 방장이 아닌 경우, 관리자 해임에 실패합니다.',
  })
  @ApiNotFoundResponse({
    description:
      '채팅방 ID나 유저 ID가 존재하지 않는 경우, 관리자 해임에 실패합니다.',
  })
  @ApiConflictResponse({
    description:
      '채팅방 관리자가 아닌 유저를 관리자 해임 시도하는 경우, 자기 자신을 관리자 해임하려는 경우, 관리자 해임에 실패합니다.',
  })
  @HttpCode(HttpStatus.OK)
  @Patch('/demote-admin/:room_id/:target_user_id')
  async demoteUserFromAdmin(
    @User() user: UserDto,
    @Param('room_id', ParseIntPipe) roomId: number,
    @Param('target_user_id', ParseIntPipe) targetUserId: number,
  ): Promise<void> {
    this.logger.log(`Called ${this.demoteUserFromAdmin.name}`);
    // 1. 해당 채팅방 정보 확인
    const chatroomInfo = this.chatroomService.getChatroomInfo(roomId);
    if (!chatroomInfo) {
      throw new NotFoundException('존재하지 않는 채팅방입니다.');
    }

    // 2. 존재하지 않는 유저인지 확인
    if (!chatroomInfo.users.includes(targetUserId)) {
      throw new NotFoundException('채팅방에 존재하지 않는 유저입니다.');
    }

    // 3. 해당 채팅방 방장인지 확인
    const userChatMode = this.chatroomService.getChatroomUserMode(
      chatroomInfo,
      user.userId,
    );
    if (userChatMode !== UserChatMode.MASTER) {
      throw new ForbiddenException(
        '채팅방 방장만 관리자를 해임할 수 있습니다.',
      );
    }

    // 4. 자기 자신을 관리자 해임하는지 확인
    if (user.userId === targetUserId) {
      throw new ConflictException('자기 자신을 관리자에서 해임할 수 없습니다.');
    }

    // 5. 대상 유저가 채팅방 관리자인지 확인
    const targetUserChatMode = this.chatroomService.getChatroomUserMode(
      chatroomInfo,
      targetUserId,
    );
    if (targetUserChatMode === UserChatMode.NORMAL) {
      throw new ConflictException('해당 유저는 채팅방 관리자가 아닙니다.');
    }

    // 6. 채팅방 관리자 해임
    this.eventEmitter.emit('chatroom:demote-admin', roomId, targetUserId);
  }

  @ApiOperation({
    summary: '채팅 금지',
    description:
      '해당 유저의 채팅을 금지시킵니다. duration은 초 단위입니다. 이미 채팅 금지된 유저의 경우, 채팅 금지 기간이 연장됩니다.',
  })
  @ApiOkResponse({
    description: '해당 유저의 채팅을 금지시키는데 성공합니다.',
  })
  @ApiBadRequestResponse({
    description: '문법적인 오류가 있을 경우 채팅 금지에 실패합니다.',
  })
  @ApiForbiddenResponse({
    description:
      '채팅방 관리자가 아닌 경우, 자신 이상의 등급의 관리자를 채팅 금지 시도하는 경우, 채팅 금지에 실패합니다.',
  })
  @ApiNotFoundResponse({
    description:
      '채팅방 ID나 유저 ID가 존재하지 않는 경우, 채팅 금지에 실패합니다.',
  })
  @ApiConflictResponse({
    description: '자기 자신을 채팅 금지 시도하는 경우, 채팅 금지에 실패합니다.',
  })
  @HttpCode(HttpStatus.OK)
  @Patch('/mute/:room_id/:target_user_id/:duration')
  async muteUserFromChatroom(
    @User() user: UserDto,
    @Param('room_id', ParseIntPipe) roomId: number,
    @Param('target_user_id', ParseIntPipe) targetUserId: number,
    @Param('duration', ParseIntPipe) duration: number,
  ): Promise<void> {
    this.logger.log(`Called ${this.muteUserFromChatroom.name}`);
    // 1. 해당 채팅방 정보 확인
    const chatroomInfo = this.chatroomService.getChatroomInfo(roomId);
    if (!chatroomInfo) {
      throw new NotFoundException('존재하지 않는 채팅방입니다.');
    }

    // 2. 존재하지 않는 유저인지 확인
    if (!chatroomInfo.users.includes(targetUserId)) {
      throw new NotFoundException('채팅방에 존재하지 않는 유저입니다.');
    }

    // 3. 해당 채팅방 관리자인지 확인
    const userChatMode = this.chatroomService.getChatroomUserMode(
      chatroomInfo,
      user.userId,
    );
    if (userChatMode === UserChatMode.NORMAL) {
      throw new ForbiddenException('채팅방 관리자가 아닙니다.');
    }

    // 4. 자기 자신을 채팅 금지 시도하는지 확인
    if (user.userId === targetUserId) {
      throw new ConflictException('자기 자신을 채팅 금지할 수 없습니다.');
    }

    // 5. 자신 이상의 등급의 관리자를 채팅 금지 시도하는지 확인
    const targetUserChatMode = this.chatroomService.getChatroomUserMode(
      chatroomInfo,
      targetUserId,
    );
    if (
      !this.chatroomService.isHigherChatMode(userChatMode, targetUserChatMode)
    ) {
      throw new ForbiddenException(
        '자신 이상의 등급의 관리자를 채팅 금지할 수 없습니다.',
      );
    }

    // 6. 채팅 금지
    this.eventEmitter.emit(
      'chatroom:mute-user',
      roomId,
      targetUserId,
      duration,
    );
  }

  @ApiOperation({
    summary: '채팅 금지 해제',
    description: '해당 유저의 채팅 금지를 해제합니다.',
  })
  @ApiOkResponse({
    description: '해당 유저의 채팅 금지를 해제하는데 성공합니다.',
  })
  @ApiBadRequestResponse({
    description: '문법적인 오류가 있을 경우 채팅 금지 해제에 실패합니다.',
  })
  @ApiForbiddenResponse({
    description:
      '채팅방 관리자가 아닌 경우, 자신 이상의 등급의 관리자를 채팅 금지 해제 시도하는 경우, 채팅 금지 해제에 실패합니다.',
  })
  @ApiNotFoundResponse({
    description:
      '채팅방 ID나 유저 ID가 존재하지 않는 경우, 채팅 금지 해제에 실패합니다.',
  })
  @ApiConflictResponse({
    description:
      '채팅 금지 상태가 아닌 유저를 채팅 금지 해제 시도하는 경우, 채팅 금지 해제에 실패합니다.',
  })
  @HttpCode(HttpStatus.OK)
  @Patch('/unmute/:room_id/:target_user_id')
  async unmuteUserFromChatroom(
    @User() user: UserDto,
    @Param('room_id', ParseIntPipe) roomId: number,
    @Param('target_user_id', ParseIntPipe) targetUserId: number,
  ): Promise<void> {
    this.logger.log(`Called ${this.unmuteUserFromChatroom.name}`);
    // 1. 해당 채팅방 정보 확인
    const chatroomInfo = this.chatroomService.getChatroomInfo(roomId);
    if (!chatroomInfo) {
      throw new NotFoundException('존재하지 않는 채팅방입니다.');
    }

    // 2. 존재하지 않는 유저인지 확인
    if (!chatroomInfo.users.includes(targetUserId)) {
      throw new NotFoundException('채팅방에 존재하지 않는 유저입니다.');
    }

    // 3. 해당 채팅방 관리자인지 확인
    const userChatMode = this.chatroomService.getChatroomUserMode(
      chatroomInfo,
      user.userId,
    );
    if (userChatMode === UserChatMode.NORMAL) {
      throw new ForbiddenException('채팅방 관리자가 아닙니다.');
    }

    // 4. 자기 자신을 채팅 금지 해제 시도하는지 확인
    if (user.userId === targetUserId) {
      throw new ConflictException('자기 자신을 채팅 금지 해제할 수 없습니다.');
    }

    // 5. 자신 이상의 등급의 관리자를 채팅 금지 해제 시도하는지 확인
    const targetUserChatMode = this.chatroomService.getChatroomUserMode(
      chatroomInfo,
      targetUserId,
    );
    if (
      !this.chatroomService.isHigherChatMode(userChatMode, targetUserChatMode)
    ) {
      throw new ForbiddenException(
        '자신 이상의 등급의 관리자를 채팅 금지 해제할 수 없습니다.',
      );
    }

    // 6. 채팅 금지 해제
    this.eventEmitter.emit('chatroom:unmute-user', roomId, targetUserId);
  }

  @ApiOperation({
    summary: '채팅방 정보 변경',
    description: '채팅방의 정보를 변경합니다.(방유형, 방제목, 방비밀번호)',
  })
  @ApiOkResponse({
    description: '채팅방의 정보를 변경하는데 성공합니다.',
  })
  @ApiBadRequestResponse({
    description: '문법적인 오류가 있을 경우 채팅방 정보 변경에 실패합니다.',
  })
  @ApiForbiddenResponse({
    description: '채팅방 방장이 아닌 경우, 채팅방 정보 변경에 실패합니다.',
  })
  @ApiNotFoundResponse({
    description:
      '채팅방 ID가 존재하지 않는 경우, 채팅방 정보 변경에 실패합니다.',
  })
  @ApiConflictResponse({
    description: '채팅방 정보 변경에 실패합니다.',
  })
  @HttpCode(HttpStatus.OK)
  @Patch('/change-info/:room_id')
  async changeChatroomInfo(
    @User() user: UserDto,
    @Param('room_id', ParseIntPipe) roomId: number,
    @Body(new ValidationPipe())
    changeChatroomInfoDto: ChangeChatroomInfoRequestDto,
  ): Promise<void> {
    this.logger.log(`Called ${this.changeChatroomInfo.name}`);
    // 1. 해당 채팅방 정보 확인
    const chatroomInfo = this.chatroomService.getChatroomInfo(roomId);
    if (!chatroomInfo) {
      throw new NotFoundException('존재하지 않는 채팅방입니다.');
    }

    // 2. 해당 채팅방 방장인지 확인
    if (chatroomInfo.masterUser !== user.userId) {
      throw new ForbiddenException('채팅방 방장만 변경할 수 있습니다.');
    }

    // 3. 채팅방 정보 변경
    this.eventEmitter.emit(
      'chatroom:change-info',
      roomId,
      changeChatroomInfoDto,
    );
  }
}
