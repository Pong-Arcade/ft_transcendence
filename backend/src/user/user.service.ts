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
import { RankListResponseDto } from '../dto/response/rank.list.response.dto';
import { SortDirection } from '../enum/sort.direction.enum';
import { RankingFilter } from '../enum/ranking.filter.enum';
import { RankDto } from '../dto/rank.dto';
import { users } from '../status/status.module';
import { UserStatus } from '../enum/user.status.enum';

@Injectable()
export class UserService {
  private logger = new Logger(UserService.name);

  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @Inject(forwardRef(() => StatService)) private statService: StatService,
  ) {}

  /**
   * 모든 유저 정보를 가져옵니다.
   */
  async getAllUsers(): Promise<UserDto[]> {
    this.logger.log(`Called ${this.getAllUsers.name}`);
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
      await this.cacheManager.set(`user-${userId}`, userInfo, 60 * 10);
    }
    return userInfo;
  }

  async getUserDetail(userId: number): Promise<UserDetailResponseDto> {
    this.logger.log(`Called ${this.getUserDetail.name}`);
    const userDto: UserDto = await this.getUserInfo(userId);
    const rankList: RankListResponseDto = await this.statService.getRanking(
      RankingFilter.LADDER_SCORE,
      SortDirection.ASC,
    );

    const rank: RankDto = rankList.rankList.find(
      (user) => user.userInfo.userId === userId,
    );
    return {
      userId: userId,
      intraId: userDto.nickname,
      ladderInfo: {
        ladderScore: rank.ladderScore,
        ranking: rank.ranking,
        winCount: rank.winCount,
        loseCount: rank.loseCount,
        winRate: rank.winRate,
      },
      userStatus: (() => {
        const user = users.get(userId);
        if (user === undefined) return UserStatus.OFFLINE;
        else if (user.location === 0) return UserStatus.LOBBY;
        else if (user.location < 0) return UserStatus.GAME;
        else return UserStatus.CHAT;
      })(),
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
