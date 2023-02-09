import { UserChatDto } from '../user.chat.dto';

/**
 * 채팅방에 참여한 유저들의 정보를 반환하는 dto입니다.
 * @property mastUserId 방장의 유저 id
 * @property users 채팅방에 참여한 유저들의 정보
 */
export class ChatroomUsersInfoResponseDto {
  mastUserId: number; // 방장의 유저 id
  users: UserChatDto[]; // 채팅방에 참여한 유저들의 정보
}
