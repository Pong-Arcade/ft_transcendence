import { Inject, Injectable, Logger } from '@nestjs/common';
import { UserDto } from 'src/dto/user.dto';
import { IUserRepository } from './repository/user.repository.interface';
import User from '../entity/user.entity';

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
  async createUser(userDto: UserDto): Promise<UserDto> {
    this.logger.log(`Called ${this.createUser.name}`);
    return await this.userRepository.createUser(userDto);
  }

  async deleteUser(userId: number): Promise<void> {
    this.logger.log(`Called ${this.deleteUser.name}`);
    return await this.userRepository.deleteUser(userId);
  }

  async getAllUsers(): Promise<UserDto[]> {
    this.logger.log(`Called ${this.getAllUsers.name}`);
    return await this.userRepository.getAllUser();
  }

  async getUserInfo(userId: number): Promise<UserDto> {
    this.logger.log(`Called ${this.getUserInfo.name}`);
    return await this.userRepository.getUserInfo(userId);
  }
}
