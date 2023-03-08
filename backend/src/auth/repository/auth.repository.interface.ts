import { UserAuthDto } from 'src/dto/user.auth.dto';
import { UserDto } from 'src/dto/user.dto';

export interface IAuthRepository {
  /**
   * 새로운 유저를 생성합니다.
   * 해당 유저의 normal/ladder 전적과 2차 인증 정보도 생성합니다.
   * @param user
   */
  addNewUser(user: UserDto): Promise<UserAuthDto>;

  /**
   * 유저의 ID로 인증 정보를 조회합니다.
   * 유저가 존재한다면 유저의 인증 정보를 반환합니다.
   * 존재하지 않는다면 null을 반환합니다.
   * @param userId
   */
  getUserAuthInfoById(userId: number): Promise<UserAuthDto>;

  /**
   * 유저의 닉네임으로 인증 정보를 조회합니다.
   * 유저가 존재한다면 true, 존재하지 않는다면 false를 반환합니다.
   */
  findUserByNickname(nickname: string): Promise<boolean>;

  /**
   * 2FA를 등록합니다.
   * @param userId
   */
  enroll2FA(userId: number): Promise<void>;

  /**
   * 2FA를 수행합니다.
   * @param access
   */
  verify2FA(token): Promise<UserDto>;
}
