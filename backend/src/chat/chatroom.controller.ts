import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Logger,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ChatRoomListResponseDto } from 'src/dto/response/chatroom.list.response.dto';
import { ChatRoomListDto } from 'src/dto/chatroom.list.dto';
import { ChatroomUsersInfoResponseDto } from 'src/dto/response/chatroom.users.info.response.dto';
import { User } from 'src/decorator/user.decorator';
import { UserDto } from 'src/dto/user.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ChatRoomMode } from 'src/enum/chatroom.mode.enum';
import { rooms } from './chat.geteway';

@ApiTags('Chatroom')
@Controller('api/chat-rooms')
export class ChatroomController {
  private logger = new Logger(ChatroomController.name);

  constructor(private readonly eventEmitter: EventEmitter2) {}

  @ApiOperation({
    summary: '전체 채팅방 목록 조회',
    description: '전체 채팅방 목록을 조회합니다.',
  })
  @ApiOkResponse({
    description: '전체 채팅방 목록을 반환합니다.',
    type: ChatRoomListResponseDto,
  })
  @Get()
  async getAllChatrooms(): Promise<ChatRoomListResponseDto> {
    this.logger.log(`Called ${this.getAllChatrooms.name}`);
    // map에 전체 항목에 대해 콜백을 실행하고, 그 결과를 배열로 반환
    const chatrooms: ChatRoomListDto[] = [];
    for (const [roomId, room] of rooms.entries()) {
      chatrooms.push({
        roomId: roomId,
        title: room.roomname,
        mode: ChatRoomMode.PRIVATE,
        maxUserCount: room.maxUser,
        currentCount: room.Users.length,
      });
    }
    return {
      chatRooms: chatrooms,
    } as ChatRoomListResponseDto;
  }

  @ApiOperation({
    summary: '채팅방 입장',
    description: '채팅방에 입장합니다.',
  })
  @Post('/join/:room_id')
  async joinChatroom(
    @User() user: UserDto,
    @Param('room_id', ParseIntPipe) roomId: number,
    @Body() password?: string,
  ): Promise<ChatroomUsersInfoResponseDto> {
    this.logger.log(`Called ${this.joinChatroom.name}`);
    // 1. 해당 채팅방 정보 확인
    const chatroomInfo = rooms.get(roomId);
    // 2. 비밀번호 채팅방인 경우, 비밀번호가 일치하는지 확인
    // if (chatroomInfo.type === ChatRoomMode.PROTECTED) {
    if (chatroomInfo.password !== password) {
      // 비밀번호가 일치하지 않음
      throw new ForbiddenException('비밀번호가 일치하지 않습니다.');
    }
    // }
    // 3. 추방당한 유저인지 확인
    // 4. 채팅방에 입장
    this.eventEmitter.emit('chatroom:join', roomId, user.userId);
    // return await this.chatroomService.getChatroomUsersInfo(roomId);
    return new ChatroomUsersInfoResponseDto();
  }
}
