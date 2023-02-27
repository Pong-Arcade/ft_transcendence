import { CACHE_MANAGER, Inject, Injectable, Logger } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { UserDto } from 'src/dto/user.dto';
import { IAuthRepository } from './repository/auth.repository.interface';
import { UserAuthDto } from 'src/dto/user.auth.dto';

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
    const [userInfo, isFirstLogin] =
      await this.authRepository.addUserIfNotExists(user);
    await this.cacheManager.set(`auth-${user.userId}`, true, 0);
    return [userInfo, isFirstLogin];
  }

  async checkUserExists(userId: number): Promise<boolean> {
    const exist = await this.cacheManager.get<boolean>(`auth-${userId}`);
    if (exist === undefined) {
      const result = await this.authRepository.checkUserExists(userId);
      await this.cacheManager.set(`auth-${userId}`, true, 0);
      return result;
    }
    return exist;
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
