import { Inject, Injectable, Logger } from '@nestjs/common';
import { UserDto } from 'src/dto/user.dto';
import { IUserRepository } from './repository/user.repository.interface';

@Injectable()
export class UserService {
  private logger = new Logger(UserService.name);

  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  /**
   * userId로 유저 정보를 가져옵니다.
   * @param userId
   */
  async getUserInfo(userId: number): Promise<UserDto> {
    this.logger.log(`Called ${this.getUserInfo.name}`);
    return await this.userRepository.getUserInfo(userId);
  }
}
