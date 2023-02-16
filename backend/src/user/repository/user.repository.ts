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

  async createUser(userDto: UserDto): Promise<UserDto> {
    this.logger.log(`Called ${this.createUser.name}`);
    const ret = await this.userRepository.create(userDto);
    console.log(ret);
    return ret as UserDto;
  }

  async deleteUser(userId: number): Promise<void> {
    this.logger.log(`Called ${this.deleteUser.name}`);
    await this.userRepository.delete(userId);
  }

  async getAllUser(): Promise<User[]> {
    this.logger.log(`Called ${this.getAllUser.name}`);
    const ret = await this.userRepository.find();
    console.log(ret);
    return ret;
  }

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
