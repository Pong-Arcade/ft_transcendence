import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDto } from 'src/dto/user.dto';
import User from 'src/entity/user.entity';
import { Repository } from 'typeorm';
import { IUserRepository } from './user.repository.interface';
import Relation from '../../entity/relation.entity';
import { UserFriendListResponseDto } from '../../dto/response/user.friend.list.response.dto';

export class UserRepository implements IUserRepository {
  private logger = new Logger(UserRepository.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createUser(userDto: UserDto): Promise<UserDto> {
    this.logger.log(`Called ${this.createUser.name}`);
    const user: User = this.userRepository.create({
      userId: userDto.userId,
      nickname: userDto.nickname,
      email: userDto.email,
      avatarUrl: userDto.avatarUrl,
      firstLogin: userDto.firstLogin,
    });
    const ret = this.userRepository.save(user);
    if (!ret) {
      return null;
    }
    return {
      userId: user.userId,
      avatarUrl: user.avatarUrl,
      email: user.email,
      nickname: user.nickname,
      firstLogin: user.firstLogin,
    } as UserDto;
  }

  async deleteUser(userId: number): Promise<void> {
    this.logger.log(`Called ${this.deleteUser.name}`);
    await this.userRepository.delete(userId);
  }

  async getAllUser(): Promise<UserDto[]> {
    this.logger.log(`Called ${this.getAllUser.name}`);
    const ret = await this.userRepository.find();
    const userPromises = ret.map((user: User) => user as UserDto);

    return (await Promise.all(userPromises)) as UserDto[];
  }

  async getUserInfo(userId: number): Promise<UserDto> {
    this.logger.log(`Called ${this.getUserInfo.name}`);
    const user = await this.userRepository.findOne({
      where: { userId },
    });
    console.log(user);
    if (!user) {
      return null;
    }
    return {
      userId: user.userId,
      nickname: user.nickname,
      email: user.email,
      avatarUrl: user.avatarUrl,
      firstLogin: user.firstLogin,
    } as UserDto;
  }

  async updateUser(userId: number, userDto: Partial<UserDto>): Promise<User> {
    const ret = this.userRepository.update(userId, userDto);
    const user = this.userRepository.findOne({ where: { userId: userId } });
    if (!user) {
      return null;
    }
    console.log(user);
    return user;
  }
}
