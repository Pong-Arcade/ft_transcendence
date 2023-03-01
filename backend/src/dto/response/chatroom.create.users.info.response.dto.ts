import { ApiProperty } from '@nestjs/swagger';
import { UserChatDto } from '../user.chat.dto';

/**
 * 채팅방에 참여한 유저들의 정보와 roomId를 반환하는 dto입니다.
 * 채팅방을 생성할 때, 응답으로 제공됩니다.
 * @property mastUserId 방장의 유저 id
 * @property users 채팅방에 참여한 유저들의 정보
 */
export class ChatroomCreateUsersInfoResponseDto {
  @ApiProperty({
    description: '생성된 채팅방의 ID',
    example: 1,
  })
  roomId: number;

  @ApiProperty({
    description: '생성된 채팅방의 제목',
    example: '채팅방 제목',
  })
  title: string;

  @ApiProperty({
    description: '방장의 유저 ID',
    example: 1,
  })
  mastUserId: number;

  @ApiProperty({
    description: '최대 참여 인원',
    example: 4,
  })
  maxUserCount: number;

  @ApiProperty({
    description: '채팅방에 참여한 유저들의 정보',
    example: [
      {
        userId: 1,
        nickname: 'user1',
        avatarUrl: 'http://example.com',
      },
      {
        userId: 2,
        nickname: 'user2',
        avatarUrl: 'http://example.com',
      },
    ] as UserChatDto[],
    type: UserChatDto,
    isArray: true,
  })
  users: UserChatDto[];
}
