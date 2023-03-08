import { Injectable, Logger } from '@nestjs/common';
import { UserChatMode } from 'src/enum/user.chat.mode.enum';
import { Room } from './chatroom.entity';
import { rooms } from './chat.geteway';
import { ChatRoomListResponseDto } from 'src/dto/response/chatroom.list.response.dto';
import { ChatroomUsersInfoResponseDto } from 'src/dto/response/chatroom.users.info.response.dto';
import { UserService } from 'src/user/user.service';
import { ChatroomCreateUsersInfoResponseDto } from 'src/dto/response/chatroom.create.users.info.response.dto';
import { UserChatDto } from 'src/dto/user.chat.dto';

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
    this.logger.debug(`Called ${this.getChatroomUsersInfo.name}`);
    const chatroomUsersInfo = new ChatroomUsersInfoResponseDto();
    chatroomUsersInfo.mastUserId = chatroomInfo.masterUser;
    chatroomUsersInfo.adminUsers = new Array<number>();
    chatroomUsersInfo.title = chatroomInfo.title;
    for (const admin of chatroomInfo.adminUsers) {
      chatroomUsersInfo.adminUsers.push(admin);
    }
    chatroomUsersInfo.users = new Array<UserChatDto>();
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
    this.logger.debug(`Called ${this.getChatroomCreateUsersInfo.name}`);
    if (!roomId) return undefined;
    const chatroomInfo = this.getChatroomInfo(roomId);
    const chatroomUsersInfo = new ChatroomCreateUsersInfoResponseDto();
    chatroomUsersInfo.roomId = chatroomInfo.roomId;
    chatroomUsersInfo.mastUserId = chatroomInfo.masterUser;
    chatroomUsersInfo.users = new Array<UserChatDto>();
    chatroomUsersInfo.title = chatroomInfo.title;
    chatroomUsersInfo.maxUserCount = chatroomInfo.maxUser;
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
    this.logger.debug(`Called ${this.getAllChatrooms.name}`);
    const chatrooms = new ChatRoomListResponseDto();
    chatrooms.chatRooms = [];
    for (const room of rooms.values()) {
      if (room.roomId !== 0) {
        if (room.users.length === 0) {
          // 방의 목록을 출력하는 상황이 되었을 때 Lazy하게 빈 방을 제거
          rooms.delete(room.roomId);
        } else {
          chatrooms.chatRooms.push({
            roomId: room.roomId,
            title: room.title,
            mode: room.mode,
            maxUserCount: room.maxUser,
            currentCount: room.users.length,
          });
        }
      }
    }
    return chatrooms;
  }

  /**
   * 채팅방 정보 조회
   * @param roomId 채팅방 id
   * @returns 채팅방 정보
   */
  getChatroomInfo(roomId: number): Room {
    this.logger.debug(`Called ${this.getChatroomInfo.name}`);
    return rooms.get(roomId);
  }

  /**
   * 자신이 방장인 채팅방의 ID를 조회합니다.
   * @param userId 유저 ID
   * @returns 자신이 방장인 채팅방의 ID
   *         방장이 아닌 경우 null
   */
  getMyMasterChatroomId(userId: number): number {
    this.logger.debug(`Called ${this.getMyMasterChatroomId.name}`);
    for (const room of rooms.values()) {
      if (room.masterUser === userId) {
        return room.roomId;
      }
    }
    return null;
  }

  /**
   * 유저가 속한 채팅방 정보를 조회합니다.
   * @param userId 유저 ID
   */
  getMyChatroomInfo(userId: number): Room {
    this.logger.debug(`Called ${this.getMyChatroomInfo.name}`);
    for (const room of rooms.values()) {
      if (room.users.includes(userId)) {
        return room;
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
  //   this.logger.debug(`Called ${this.createChatroom.name}`);
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
    this.logger.debug(`Called ${this.getChatroomUserMode.name}`);
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
    this.logger.debug(`Called ${this.isHigherChatMode.name}`);
    if (userChatMode === UserChatMode.MASTER) {
      return true;
    }
    if (userChatMode === UserChatMode.ADMIN) {
      return targetUserChatMode === UserChatMode.NORMAL;
    }
    return false;
  }
}
