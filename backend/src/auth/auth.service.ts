import { CACHE_MANAGER, Inject, Injectable, Logger } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { UserDto } from 'src/dto/user.dto';
import { IAuthRepository } from './repository/auth.repository.interface';
import { UserAuthDto } from 'src/dto/user.auth.dto';
import * as uuid62 from 'uuid62';

@Injectable()
export class AuthService {
  private logger = new Logger(AuthService.name);
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @Inject('IAuthRepository')
    private readonly authRepository: IAuthRepository,
  ) {}

  async addUserIfNotExists(user: UserDto): Promise<[UserAuthDto, boolean]> {
    this.logger.debug(`Called ${this.addUserIfNotExists.name}`);
    let userAuthInfo = await this.getUserAuthInfoById(user.userId);
    let isFirstLogin = false;
    if (!userAuthInfo) {
      isFirstLogin = true;
      // 해당 닉네임을 가진 유저가 이미 존재하는지 확인
      const find = await this.authRepository.findUserByNickname(user.nickname);
      // 이미 존재하면 유저를 Insert할 때, 닉네임으로 uuid를 사용
      if (find) {
        user.nickname = uuid62.v4();
      }
      userAuthInfo = await this.authRepository.addNewUser(user);
      await this.cacheManager.set(
        `auth-${user.userId}`,
        userAuthInfo,
        60 * 10 * 1000,
      );
    }
    return [userAuthInfo, isFirstLogin];
  }

  async getUserAuthInfoById(userId: number): Promise<UserAuthDto> {
    this.logger.debug(`Called ${this.getUserAuthInfoById.name}`);
    let userAuthInfo = await this.cacheManager.get<UserAuthDto>(
      `auth-${userId}`,
    );
    if (!userAuthInfo) {
      userAuthInfo = await this.authRepository.getUserAuthInfoById(userId);
      if (!userAuthInfo) {
        return null;
      }
      await this.cacheManager.set(
        `auth-${userId}`,
        userAuthInfo,
        60 * 10 * 1000,
      );
    }
    return userAuthInfo;
  }

  async enroll2FA(userId: number): Promise<void> {
    this.logger.debug(`Called ${this.enroll2FA.name}`);
    await this.authRepository.enroll2FA(userId);
  }

  async verify2FA(access: string): Promise<UserDto> {
    this.logger.debug(`Called ${this.verify2FA.name}`);
    return await this.authRepository.verify2FA(access);
  }
}
