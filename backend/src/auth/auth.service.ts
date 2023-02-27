import { CACHE_MANAGER, Inject, Injectable, Logger } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { UserDto } from 'src/dto/user.dto';
import { IAuthRepository } from './repository/auth.repository.interface';

@Injectable()
export class AuthService {
  private logger = new Logger(AuthService.name);
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @Inject('IAuthRepository')
    private readonly authRepository: IAuthRepository,
  ) {}

  async addUserIfNotExists(user: UserDto): Promise<boolean> {
    this.logger.debug(`Called ${this.addUserIfNotExists.name}`);
    const find = await this.authRepository.addUserIfNotExists(user);
    await this.cacheManager.set(`auth-${user.userId}`, true, 0);
    return find;
  }

  async checkUserExists(userId: number): Promise<boolean> {
    this.logger.debug(`Called ${this.checkUserExists.name}`);
    const exist = await this.cacheManager.get<boolean>(`auth-${userId}`);
    if (exist === undefined) {
      const result = await this.authRepository.checkUserExists(userId);
      await this.cacheManager.set(`auth-${userId}`, true, 0);
      return result;
    }
    return exist;
  }
}
