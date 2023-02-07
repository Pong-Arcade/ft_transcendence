import { UserDto } from 'src/dto/user.dto';

export interface IAuthRepository {
  /**
   * 유저가 존재하지 않는다면 유저를 추가합니다.
   * 유저가 기존에 존재했었다면 true를 반환합니다.
   * 신규로 유저가 추가되었다면 false를 반환합니다.
   * @param user
   */
  addUserIfNotExists(user: UserDto): Promise<boolean>;
}
