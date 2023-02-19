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
  ) {}

  /**
   * 모든 유저 정보를 가져옵니다.
   */
  async getAllUsers(): Promise<any> {
    this.logger.log(`Called ${this.getAllUsers.name}`);
    console.log(this.chatGateway.server.sockets);
    console.log(this.gameGateway.server.sockets);
    return await this.userRepository.getAllUser();
  }

  /**
   * userId로 유저 정보를 가져옵니다.
   * @param userId
   */
  async getUserInfo(userId: number): Promise<UserDto> {
    this.logger.log(`Called ${this.getUserInfo.name}`);
    return await this.userRepository.getUserInfo(userId);
  }

  /**
   * 유저 정보를 업데이트합니다.
   * 닉네임 혹은 아바타 이미지를 변경할 수 있습니다.
   * @param userId
   * @param newNickname
   * @param newAvatarUrl
   */
  async updateUserInfo(
    userId: number,
    newNickname?: string,
    newAvatarUrl?: string,
  ): Promise<UserDto> {
    this.logger.log(`Called ${this.updateUserInfo.name}`);
    return await this.userRepository.updateUserInfo(
      userId,
      newNickname,
      newAvatarUrl,
    );
  }
}
