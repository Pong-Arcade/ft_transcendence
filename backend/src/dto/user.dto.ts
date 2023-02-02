/**
 * pong 게임 유저의 정보를 저장합니다.
 * avatarUrl은 사용자의 프로필 사진을 저장합니다.
 * 해당 필드는 확장성을 위해 optional로 설정되어 있습니다.
 */
export class UserDto {
  userId: number; // 유저의 ID
  nickname: string; // 유저의 닉네임
  avatarUrl?: string; // 아바타 이미지 url
}
