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
    const user = await this.userRepository.create(userDto);
    if (!user) return null;
    return {
      userId: user.userId,
      avatarUrl: user.avatarUrl,
      email: user.email,
      nickname: user.nickname,
    } as UserDto;
  }

  async deleteUser(userId: number): Promise<void> {
    this.logger.log(`Called ${this.deleteUser.name}`);
    await this.userRepository.delete(userId);
  }

  async getAllUser(): Promise<User[]> {
    this.logger.log(`Called ${this.getAllUser.name}`);
    console.log(this.userRepository);
    const ret = await this.userRepository.find();
    console.log(ret);
    return ret;
  }

  async getUserInfo(userId: number): Promise<User> {
    this.logger.log(`Called ${this.getUserInfo.name}`);
    const user = await this.userRepository.findOne({
      where: { userId: userId },
    });
    console.log(user);
    if (!user) {
      return null;
    }
    return user;
  }
}
