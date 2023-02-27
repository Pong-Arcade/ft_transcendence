import { Logger } from '@nestjs/common';
import { IAuthRepository } from './auth.repository.interface';
import User from 'src/entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserDto } from 'src/dto/user.dto';
import NormalStat from 'src/entity/normal.stat.entity';
import LadderStat from 'src/entity/ladder.stat.entity';
import { TwoFactorAuth } from 'src/entity/two.factor.auth.entity';

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
    return false;
  }

  async checkUserExists(userId: number): Promise<boolean> {
    const find = await this.userRepository.findOne({
      where: { userId },
    });
    return find ? true : false;
  }
}
