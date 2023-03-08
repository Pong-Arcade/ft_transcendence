import { Logger } from '@nestjs/common';
import { IAuthRepository } from './auth.repository.interface';
import User from 'src/entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserDto } from 'src/dto/user.dto';
import NormalStat from 'src/entity/normal.stat.entity';
import LadderStat from 'src/entity/ladder.stat.entity';
import { TwoFactorAuth } from 'src/entity/two.factor.auth.entity';
import { UserAuthDto } from 'src/dto/user.auth.dto';
import { v4 as uuid } from 'uuid';

export class AuthRepository implements IAuthRepository {
  private logger = new Logger(AuthRepository.name);
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(TwoFactorAuth)
    private readonly twoFactorAuthRepository: Repository<TwoFactorAuth>,
  ) {}

  /**
   * 새로운 유저를 생성합니다.
   * 해당 유저의 normal/ladder 전적과 2차 인증 정보도 생성합니다.
   * @param user
   */
  async addNewUser(user: UserDto): Promise<UserAuthDto> {
    this.logger.debug(`Called ${this.addNewUser.name}`);
    const firstLogin = new Date();
    // Start transaction
    this.userRepository.manager.transaction(
      async (transactionalEntityManager) => {
        await transactionalEntityManager.insert(User, {
          userId: user.userId,
          nickname: user.nickname,
          avatarUrl: user.avatarUrl,
          email: user.email,
          firstLogin,
        });

        await transactionalEntityManager.insert(TwoFactorAuth, {
          userId: user.userId,
          is2FA: false,
          access: null,
        });

        await transactionalEntityManager.insert(NormalStat, {
          userId: user.userId,
          winCount: 0,
          loseCount: 0,
        });

        await transactionalEntityManager.insert(LadderStat, {
          userId: user.userId,
          ladderScore: 1000,
          winCount: 0,
          loseCount: 0,
        });
      },
    );

    return {
      userId: user.userId,
      nickname: user.nickname,
      avatarUrl: user.avatarUrl,
      email: user.email,
      firstLogin,
      is2FA: false,
      access: null,
    };
  }

  async getUserAuthInfoById(userId: number): Promise<UserAuthDto> {
    this.logger.debug(`Called ${this.getUserAuthInfoById.name}`);
    if (!userId) {
      return null;
    }
    const find = await this.userRepository.findOne({
      where: { userId },
      relations: {
        twoFactorAuth: true,
      },
      select: {
        userId: true,
        nickname: true,
        avatarUrl: true,
        email: true,
        firstLogin: true,
        twoFactorAuth: {
          is2FA: true,
          access: true,
        },
      },
    });
    if (!find) {
      return null;
    }
    return {
      userId: find.userId,
      nickname: find.nickname,
      avatarUrl: find.avatarUrl,
      email: find.email,
      firstLogin: find.firstLogin,
      is2FA: find.twoFactorAuth.is2FA,
      access: find.twoFactorAuth.access,
    };
  }

  async findUserByNickname(nickname: string): Promise<boolean> {
    this.logger.debug(`Called ${this.findUserByNickname.name}`);
    const find = await this.userRepository.findOne({
      where: { nickname },
    });
    if (!find) {
      return false;
    }
    return true;
  }

  async enroll2FA(userId: number): Promise<void> {
    this.logger.debug(`Called ${this.enroll2FA.name}`);
    const find = await this.twoFactorAuthRepository.findOne({
      where: { userId },
    });
    if (!find) {
      throw new Error('User not found');
    }
    await this.twoFactorAuthRepository.update(userId, {
      is2FA: true,
      access: uuid(),
    });
  }

  async verify2FA(access: string): Promise<UserDto> {
    this.logger.debug(`Called ${this.verify2FA.name}`);
    const find = await this.userRepository.findOne({
      relations: {
        twoFactorAuth: true,
      },
      where: {
        twoFactorAuth: {
          access,
        },
      },
      select: {
        userId: true,
        nickname: true,
        avatarUrl: true,
        email: true,
        firstLogin: true,
      },
    });
    if (!find) {
      return null;
    }
    if (find.twoFactorAuth.access === access) {
      return {
        userId: find.userId,
        nickname: find.nickname,
        avatarUrl: find.avatarUrl,
        email: find.email,
        firstLogin: find.firstLogin,
      };
    }
    return null;
  }
}
