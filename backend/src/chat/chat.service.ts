import { Injectable, Logger } from '@nestjs/common';
import { UserChatMode } from 'src/enum/user.chat.mode.enum';
import { Room } from './chatroom.entity';
import { rooms } from './chat.geteway';
import { ChatRoomListResponseDto } from 'src/dto/response/chatroom.list.response.dto';
import { ChatroomUsersInfoResponseDto } from 'src/dto/response/chatroom.users.info.response.dto';
import { UserService } from 'src/user/user.service';
import { ChatroomCreateUsersInfoResponseDto } from 'src/dto/response/chatroom.create.users.info.response.dto';

@Injectable()
export class ChatroomService {
  private logger = new Logger(ChatroomService.name);

  constructor(private readonly userService: UserService) {}

  /**
   * 채팅방에 속한 유저 정보를 조회합니다.
   * @param chatroomInfo 채팅방 정보
   * @returns 채팅방에 속한 유저 정보
   */
  async getChatroomUsersInfo(
    chatroomInfo: Room,
  ): Promise<ChatroomUsersInfoResponseDto> {
    this.logger.log(`Called ${this.getChatroomUsersInfo.name}`);
    const chatroomUsersInfo = new ChatroomUsersInfoResponseDto();
    chatroomUsersInfo.mastUserId = chatroomInfo.masterUser;
    for (const userId of chatroomInfo.users) {
      const userInfo = await this.userService.getUserInfo(userId);
      chatroomUsersInfo.users.push({
        userId: userInfo.userId,
        nickname: userInfo.nickname,
        avatarUrl: userInfo.avatarUrl,
        mode: this.getChatroomUserMode(chatroomInfo, userId),
      });
    }
    return chatroomUsersInfo;
  }

  /**
   * 채팅방에 속한 유저 정보를 조회합니다.
   * 채팅방 ID를 추가로 제공합니다.
   * @param roomId 채팅방 ID
   * @returns 채팅방에 속한 유저 정보
   */
  async getChatroomCreateUsersInfo(
    roomId: number,
  ): Promise<ChatroomCreateUsersInfoResponseDto> {
    this.logger.log(`Called ${this.getChatroomCreateUsersInfo.name}`);
    const chatroomInfo = this.getChatroomInfo(roomId);
    const chatroomUsersInfo = new ChatroomCreateUsersInfoResponseDto();
    chatroomUsersInfo.roomId = chatroomInfo.id;
    chatroomUsersInfo.mastUserId = chatroomInfo.masterUser;
    for (const userId of chatroomInfo.users) {
      const userInfo = await this.userService.getUserInfo(userId);
      chatroomUsersInfo.users.push({
        userId: userInfo.userId,
        nickname: userInfo.nickname,
        avatarUrl: userInfo.avatarUrl,
        mode: this.getChatroomUserMode(chatroomInfo, userId),
      });
    }
    return chatroomUsersInfo;
  }

  /**
   * 전체 채팅방 목록을 조회합니다.
   * @returns 채팅방 목록
   */
  getAllChatrooms(): ChatRoomListResponseDto {
    this.logger.log(`Called ${this.getAllChatrooms.name}`);
    const chatrooms = new ChatRoomListResponseDto();
    for (const room of rooms.values()) {
      chatrooms.chatRooms.push({
        roomId: room.id,
        title: room.title,
        mode: room.mode,
        maxUserCount: room.maxUser,
        currentCount: room.users.length,
      });
    }
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
   * 자신이 방장인 채팅방의 ID를 조회합니다.
   * @param userId 유저 ID
   * @returns 자신이 방장인 채팅방의 ID
   *         방장이 아닌 경우 null
   */
  getMyMasterChatroomId(userId: number): number {
    this.logger.log(`Called ${this.getMyMasterChatroomId.name}`);
    for (const room of rooms.values()) {
      if (room.masterUser === userId) {
        return room.id;
      }
    }
    return null;
  }

  // TODO: chat gateway에서 처리하도록 변경
  // /**
  //  * 채팅방 생성
  //  * @param userId 유저 id
  //  */
  // async createChatroom(
  //   userId: number,
  //   chatroomCreateRequestDto: ChatroomCreateRequestDto,
  // ): Promise<number> {
  //   this.logger.log(`Called ${this.createChatroom.name}`);
  //   const chatroom = new Room(
  //     rooms.size + 1,
  //     chatroomCreateRequestDto.title,
  //     chatroomCreateRequestDto.mode,
  //     chatroomCreateRequestDto.password,
  //     chatroomCreateRequestDto.maxUserCount,
  //     userId,
  //   );
  //   chatroom.users.push(userId);
  //   rooms.set(chatroom.id, chatroom);
  //   return chatroom.id;
  // }

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
