import { UserDto } from 'src/dto/user.dto';

export interface IUserRepository {
  /**
   * userId로 유저 정보를 가져옵니다.
   * @param userId
   */
  createUser(userDto: UserDto): Promise<UserDto>;
  deleteUser(userId: number): Promise<void>;
  getUserInfo(userId: number): Promise<UserDto>;
  getAllUser(): Promise<UserDto[]>;
  updateUser(userId: number, userDto: UserDto): Promise<UserDto>;
}
