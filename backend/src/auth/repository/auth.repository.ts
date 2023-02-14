import { Logger } from '@nestjs/common';
import { IAuthRepository } from './auth.repository.interface';
import User from 'src/entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserDto } from 'src/dto/user.dto';

export class AuthRepository implements IAuthRepository {
  private logger = new Logger(AuthRepository.name);
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async addUserIfNotExists(user: UserDto): Promise<boolean> {
    this.logger.debug(`Called ${this.addUserIfNotExists.name}`);
    const find = await this.userRepository.findOne({
      where: { userId: user.userId },
    });
    if (find) {
      return true;
    }
    await this.userRepository.insert({
      userId: user.userId,
      nickname: user.nickname,
      avatarUrl: user.avatarUrl,
      email: user.email,
      firstLogin: new Date(),
    });
    return false;
  }

  async checkUserExists(userId: number): Promise<boolean> {
    const find = await this.userRepository.findOne({
      where: { userId },
    });
    return find ? true : false;
  }
}
