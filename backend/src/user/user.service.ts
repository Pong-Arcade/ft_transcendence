import { CACHE_MANAGER, Inject, Injectable, Logger } from '@nestjs/common';
import { UserDto } from 'src/dto/user.dto';
import { IUserRepository } from './repository/user.repository.interface';
import { Cache } from 'cache-manager';
import { ChatGateway } from 'src/chat/chat.geteway';
import { GameGateway } from 'src/game/game.gateway';

@Injectable()
export class UserService {
  private logger = new Logger(UserService.name);

  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) //private chatGateway: ChatGateway,
  //private gameGateway: GameGateway,
  {}

  /**
   * 모든 유저 정보를 가져옵니다.
   */
  async getAllUsers(): Promise<any> {
    this.logger.log(`Called ${this.getAllUsers.name}`);
    //console.log(this.chatGateway.server.sockets);
    //console.log(this.gameGateway.server.sockets);
    return await this.userRepository.getAllUser();
  }

  /**
   * userId로 유저 정보를 가져옵니다.
   * 캐싱된 유저 정보가 없으면 DB에서 가져옵니다.
   * 캐싱은 10분간 유지됩니다.
   * @param userId
   */
  async getUserInfo(userId: number): Promise<UserDto> {
    this.logger.log(`Called ${this.getUserInfo.name}`);
    // 캐싱된 유저 정보가 있는지 확인합니다.
    let userInfo = await this.cacheManager.get<UserDto>(`user-${userId}`);
    if (!userInfo) {
      userInfo = await this.userRepository.getUserInfo(userId);
      console.log('service userinfo:', userInfo);
      await this.cacheManager.set(`user-${userId}`, userInfo, 60 * 10);
    }
    return userInfo;
  }

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
