import { Inject, Injectable, Logger } from '@nestjs/common';
import { UserDto } from 'src/dto/user.dto';
import { IUserRepository } from './repository/user.repository.interface';
import { ChatGateway } from '../chat/chat.geteway';
import { GameGateway } from '../game/game.gateway';

@Injectable()
export class UserService {
  private logger = new Logger(UserService.name);

  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    private chatGateway: ChatGateway,
    private gameGateway: GameGateway,
  ) {
    this.createUser({ userId: 1, nickname: 'youngpar' });
    this.createUser({ userId: 2, nickname: 'kangkim' });
    this.createUser({ userId: 3, nickname: 'sichoi' });
    this.createUser({ userId: 4, nickname: 'bson' });
    this.createUser({ userId: 5, nickname: 'junpkim' });
  }

  /**
   * userId로 유저 정보를 가져옵니다.
   * @param userId
   */
  async createUser(userDto: UserDto): Promise<UserDto> {
    this.logger.log(`Called ${this.createUser.name}`);
    return await this.userRepository.createUser(userDto);
  }

  async updateuser(userId: number, userDto: UserDto): Promise<UserDto> {
    return (await this.userRepository.updateUser(userId, userDto)) as UserDto;
  }

  async deleteUser(userId: number): Promise<void> {
    this.logger.log(`Called ${this.deleteUser.name}`);
    return await this.userRepository.deleteUser(userId);
  }

  async getAllUsers(): Promise<any> {
    this.logger.log(`Called ${this.getAllUsers.name}`);
    console.log(this.chatGateway.server.sockets);
    console.log(this.gameGateway.server.sockets);
    return await this.userRepository.getAllUser();
  }

  async getUserInfo(userId: number): Promise<UserDto> {
    this.logger.log(`Called ${this.getUserInfo.name}`);
    return await this.userRepository.getUserInfo(userId);
  }
}
