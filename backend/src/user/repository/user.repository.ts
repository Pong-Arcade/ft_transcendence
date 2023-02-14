import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDto } from 'src/dto/user.dto';
import User from 'src/entity/user.entity';
import { Repository } from 'typeorm';
import { IUserRepository } from './user.repository.interface';

export class UserRepository implements IUserRepository {
  private logger = new Logger(UserRepository.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getUserInfo(userId: number): Promise<UserDto> {
    this.logger.log(`Called ${this.getUserInfo.name}`);
    const user = await this.userRepository.findOne({
      where: { userId },
    });
    if (!user) {
      return null;
    }
    return {
      userId: user.userId,
      nickname: user.nickname,
      avatarUrl: user.avatarUrl,
    } as UserDto;
  }
}
