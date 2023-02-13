import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ChatGateway } from './chat.geteway';
import { ChatroomUsersInfoResponseDto } from '../dto/response/chatroom.users.info.response.dto';
import { UserChatMode } from '../enum/user.chat.mode.enum';

const usersInfo: ChatroomUsersInfoResponseDto = {
  mastUserId: 1,
  users: [
    {
      userId: 1,
      nickname: 'youngpar',
      avatarUrl: 'qwe.jpeg',
      mode: UserChatMode.MASTER,
    },
    {
      userId: 2,
      nickname: 'youngpar2',
      avatarUrl: 'qwe2.jpeg',
      mode: UserChatMode.ADMIN,
    },
  ],
};

@ApiTags('Chat')
@Controller('api/chat-rooms')
export class ChatController {
  constructor(private chatGateway: ChatGateway) {}

  @ApiOperation({
    summary: '채팅방 목록',
    description: '존재하는 모든 채팅방 목록을 조회',
  })
  @Get()
  getChatList() {
    return this.chatGateway.rooms.keys();
  }

  @ApiOperation({
    summary: '채팅방 상세',
    description: '해당 채팅방의 유저 목록 확인',
  })
  @Get(':room_id')
  getChatRoom(@Param('room_id') roomId: number) {
    return this.chatGateway.rooms[roomId];
  }
}