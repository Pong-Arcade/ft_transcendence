import { UserDto } from 'src/dto/user.dto';

export interface IUserRepository {
  /**
   * userId로 유저 정보를 가져옵니다.
   * @param userId
   */
  getUserInfo(userId: number): Promise<UserDto>;
}
