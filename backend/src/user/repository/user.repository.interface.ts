import { UserDto } from 'src/dto/user.dto';

export interface IUserRepository {
  /**
   * userId로 유저 정보를 가져옵니다.
   * @param userId
   */
  getUserInfo(userId: number): Promise<UserDto>;

  /**
   * 유저 정보를 업데이트합니다.
   * 닉네임 혹은 아바타 이미지를 변경할 수 있습니다.
   * @param userId
   * @param newNickname
   * @param newAvatarUrl
   */
  updateUserInfo(
    userId: number,
    newNickname?: string,
    newAvatarUrl?: string,
  ): Promise<UserDto>;
}
