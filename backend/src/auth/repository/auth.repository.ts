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
    @InjectRepository(NormalStat)
    private readonly normalStatRepository: Repository<NormalStat>,
    @InjectRepository(LadderStat)
    private readonly ladderStatRepository: Repository<LadderStat>,
    @InjectRepository(TwoFactorAuth)
    private readonly twoFactorAuthRepository: Repository<TwoFactorAuth>,
  ) {}

  /**
   * 유저가 존재하지 않으면 유저를 추가한다.
   * NormalStat과 LadderStat도 함께 생성한다.
   * FIXME: 트랜잭션 처리가 필요합니다.
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

    const firstLogin = new Date();
    await this.userRepository.insert({
      userId: user.userId,
      nickname: user.nickname,
      avatarUrl: user.avatarUrl,
      email: user.email,
      firstLogin,
    });

    await this.twoFactorAuthRepository.insert({
      userId: user.userId,
      is2FA: false,
      access: null,
    });

    await this.normalStatRepository.insert({
      userId: user.userId,
      winCount: 0,
      loseCount: 0,
    });

    await this.ladderStatRepository.insert({
      userId: user.userId,
      ladderScore: 1000,
      winCount: 0,
      loseCount: 0,
    });
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
      // FIXME: bcrypt로 암호화한 값으로 저장해야 함.
      access: uuid(),
    });
  }

  // FIXME: bcrypt로 암호화한 값과 비교해야 함.
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
