import { ConflictException, Logger, NotFoundException } from '@nestjs/common';
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
    this.logger.debug(`Called ${this.getUserInfo.name}`);
    const user = await this.userRepository.findOne({
      where: { userId },
    });
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

  async updateUserInfo(
    userId: number,
    newNickname?: string,
    newAvatarUrl?: string,
  ): Promise<UserDto> {
    this.logger.debug(`Called ${this.updateUserInfo.name}`);
    // newNickname이 존재하면 닉네임을 변경합니다.
    // newAvatarUrl이 존재하면 아바타 이미지를 변경합니다.
    const user = await this.userRepository.findOne({
      where: { userId },
    });
    if (!user) {
      throw new NotFoundException('존재하지 않는 유저입니다.');
    }
    if (
      //  새로운 닉네임이 기존에 존재-> Throw
      (await this.userRepository.findOne({
        where: { nickname: newNickname },
      })) &&
      user.nickname !== newNickname
    ) {
      throw new ConflictException('이미 존재하는 닉네임입니다.');
    }
    if (newNickname) {
      user.nickname = newNickname;
    }
    if (newAvatarUrl) {
      user.avatarUrl = newAvatarUrl;
    }
    await this.userRepository.save(user);
    return user as UserDto;
  }
}
