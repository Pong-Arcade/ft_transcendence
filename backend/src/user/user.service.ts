import {
  CACHE_MANAGER,
  forwardRef,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { UserDto } from 'src/dto/user.dto';
import { IUserRepository } from './repository/user.repository.interface';
import { Cache } from 'cache-manager';
import { UserDetailResponseDto } from '../dto/response/user.detail.response.dto';
import { StatService } from '../stat/stat.service';
import { users } from 'src/status/status.module';
import { UserStatus } from 'src/enum/user.status.enum';

@Injectable()
export class UserService {
  private logger = new Logger(UserService.name);

  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @Inject(forwardRef(() => StatService))
    private statService: StatService,
  ) {}

  /**
   * 모든 유저 정보를 가져옵니다.
   */
  getAllOnlineUsers(): UserDto[] {
    this.logger.log(`Called ${this.getAllOnlineUsers.name}`);
    const results: UserDto[] = [];
    users.forEach((value, key) => {
      if (value.userId >= 0)
        results.push({
          userId: value.userId,
          nickname: value.userName,
          location: value.location,
        });
    });
    return results;
  }

  /**
   * userId로 유저 정보를 가져옵니다.
   * 캐싱된 유저 정보가 없으면 DB에서 가져옵니다.
   * 캐싱은 10분간 유지됩니다.
   * @param userId
   */
  async getUserInfo(userId: number): Promise<UserDto> {
    this.logger.log(`Called ${this.getUserInfo.name}`);
    if (userId === -1 || userId === 0) {
      return null;
    }
    // 캐싱된 유저 정보가 있는지 확인합니다.
    let userInfo = await this.cacheManager.get<UserDto>(`user-${userId}`);
    if (!userInfo) {
      userInfo = await this.userRepository.getUserInfo(userId);
      await this.cacheManager.set(`user-${userId}`, userInfo, 60 * 10);
    }
    return userInfo;
  }

  async getUserDetail(userId: number): Promise<UserDetailResponseDto> {
    this.logger.log(`Called ${this.getUserDetail.name}`);
    const userDto: UserDto = await this.getUserInfo(userId);
    const [ladderInfo, normalInfo] = await this.statService.getUserGameStat(
      userId,
    );

    const userSocketInfo = users.get(userId);
    let userStatus = UserStatus.OFFLINE;
    if (!userSocketInfo)
      return { ...userDto, status: userStatus } as UserDetailResponseDto;
    if (userSocketInfo.location === 0) {
      userStatus = UserStatus.LOBBY;
    } else if (userSocketInfo.location < 0) {
      userStatus = UserStatus.GAME;
    } else if (userSocketInfo.location > 0) {
      userStatus = UserStatus.CHAT;
    }

    return {
      ...userDto,
      status: userStatus,
      ladderInfo,
      normalInfo,
    } as UserDetailResponseDto;
  }

  /**
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
