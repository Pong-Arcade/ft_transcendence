import { Injectable, Logger } from '@nestjs/common';
import { UserChatMode } from 'src/enum/user.chat.mode.enum';
import { Room } from './chatroom.entity';
import { rooms } from './chat.geteway';
import { ChatRoomListResponseDto } from 'src/dto/response/chatroom.list.response.dto';
import { ChatroomCreateRequestDto } from 'src/dto/request/chatroom.create.request.dto';

@Injectable()
export class ChatroomService {
  private logger = new Logger(ChatroomService.name);

  constructor() {} // private readonly chatGateway: ChatGateway,

  /**
   * 채팅방에 속한 유저 정보 조회
   */
  // getChatroomUsersInfo(roomId: number): ChatroomUsersInfoResponseDto {
  //   this.logger.log(`Called ${this.getChatroomUsersInfo.name}`);
  //   const chatroom = rooms.get(roomId);
  //   if (!chatroom) {
  //     throw new NotFoundException('존재하지 않는 채팅방입니다.');
  //   }
  //   return new ChatroomUsersInfoResponseDto({
  //     mastUserId: chatroom.masterUser,
  //     users: chatroom.users,
  //   });
  // }

  async getAllChatrooms(): Promise<ChatRoomListResponseDto> {
    this.logger.log(`Called ${this.getAllChatrooms.name}`);
    // TODO: 채팅방 목록 조회
    const chatrooms = new ChatRoomListResponseDto();
    return chatrooms;
  }

  /**
   * 채팅방 정보 조회
   * @param roomId 채팅방 id
   * @returns 채팅방 정보
   */
  getChatroomInfo(roomId: number): Room {
    this.logger.log(`Called ${this.getChatroomInfo.name}`);
    return rooms.get(roomId);
  }

  /**
   * 채팅방 생성
   * @param userId 유저 id
   */
  async createChatroom(
    userId: number,
    chatroomCreateRequestDto: ChatroomCreateRequestDto,
  ): Promise<number> {
    // TODO: 채팅방 생성 후 채팅방 id 반환
    return 1;
  }

  /**
   * 채팅방에서 유저의 모드(방장/관리자/일반) 확인
   * @param roomId 채팅방 id
   * @param userId 유저 id
   * @returns 채팅방에서 유저의 모드(방장/관리자/일반)
   */
  getChatroomUserMode(chatroom: Room, userId: number): UserChatMode {
    this.logger.log(`Called ${this.getChatroomUserMode.name}`);
    if (chatroom.masterUser === userId) {
      return UserChatMode.MASTER;
    }
    if (chatroom.adminUsers.includes(userId)) {
      return UserChatMode.ADMIN;
    }
    return UserChatMode.NORMAL;
  }

  /**
   * 상대방보다 높은 권한을 가진 유저인지 확인
   * @param userChatMode
   * @param targetUserChatMode
   * @returns
   */
  isHigherChatMode(
    userChatMode: UserChatMode,
    targetUserChatMode: UserChatMode,
  ): boolean {
    this.logger.log(`Called ${this.isHigherChatMode.name}`);
    if (userChatMode === UserChatMode.MASTER) {
      return true;
    }
    if (userChatMode === UserChatMode.ADMIN) {
      return targetUserChatMode === UserChatMode.NORMAL;
    }
    return false;
  }
}
