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
import * as uuid62 from 'uuid62';

export class AuthRepository implements IAuthRepository {
  private logger = new Logger(AuthRepository.name);
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(TwoFactorAuth)
    private readonly twoFactorAuthRepository: Repository<TwoFactorAuth>,
  ) {}

  /**
   * 유저가 존재하지 않으면 유저를 추가한다.
   * NormalStat과 LadderStat도 함께 생성한다.
   * @param user
   */
  async addUserIfNotExists(user: UserDto): Promise<[UserAuthDto, boolean]> {
    this.logger.debug(`Called ${this.addUserIfNotExists.name}`);
    const find = await this.userRepository.findOne({
      where: { userId: user.userId },
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

    if (find) {
      return [
        {
          userId: find.userId,
          nickname: find.nickname,
          avatarUrl: find.avatarUrl,
          email: find.email,
          firstLogin: find.firstLogin,
          is2FA: find.twoFactorAuth.is2FA,
          access: find.twoFactorAuth.access,
        },
        false,
      ];
    }

    user.nickname = uuid62.v4();
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

    return [
      {
        userId: user.userId,
        nickname: user.nickname,
        avatarUrl: user.avatarUrl,
        email: user.email,
        firstLogin,
        is2FA: false,
      },
      true,
    ];
  }

  async checkUserExists(userId: number): Promise<boolean> {
    if (!userId) {
      return false;
    }
    const find = await this.userRepository.findOne({
      where: { userId },
    });
    return find ? true : false;
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
