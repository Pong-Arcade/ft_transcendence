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
}
