import { Logger, NotFoundException } from '@nestjs/common';
import { IStatRepository } from './stat.repository.interface';
import { InjectRepository } from '@nestjs/typeorm';
import MatchHistory from 'src/entity/match.history.entity';
import { Repository } from 'typeorm';
import { MatchResult } from 'src/enum/match.result.enum';
import { RankDto } from 'src/dto/rank.dto';
import LadderStat from 'src/entity/ladder.stat.entity';
import { RankingFilter } from 'src/enum/ranking.filter.enum';
import { SortDirection } from 'src/enum/sort.direction.enum';
import { GameStatDto } from 'src/dto/game.stat.dto';
import { MatchType } from 'src/enum/match.type.enum';
import NormalStat from 'src/entity/normal.stat.entity';
import { MyMatchHistoryDto } from 'src/dto/my.match.history.dto';
import { MatchHistoryDto } from 'src/dto/match.history.dto';

export class StatRepository implements IStatRepository {
  private logger = new Logger(StatRepository.name);
  constructor(
    @InjectRepository(MatchHistory)
    private readonly matchHistoryRepository: Repository<MatchHistory>,

    @InjectRepository(LadderStat)
    private readonly ladderStatRepository: Repository<LadderStat>,

    @InjectRepository(NormalStat)
    private readonly normalStatRepository: Repository<NormalStat>,
  ) {}

  async getRanking(
    filter: RankingFilter,
    order: SortDirection,
  ): Promise<RankDto[]> {
    this.logger.debug(`Called ${this.getRanking.name}`);
    // 전체 유저의 랭킹을 가져온다.
    const results = await this.ladderStatRepository
      .createQueryBuilder('ladder_stat')
      .leftJoinAndSelect('ladder_stat.user', 'user')
      .select([
        'user.userId as userId',
        'user.nickname as nickname',
        'user.avatarUrl as avatarUrl',
        'ladder_stat.ladderScore as ladderScore',
        'ladder_stat.winCount as winCount',
        'ladder_stat.loseCount as loseCount',
        // winCount + loseCount가 0이면 0으로 나누는 에러가 발생하므로
        // winCount + loseCount가 0이면 0으로 설정한다.
        'CASE WHEN ladder_stat.winCount + ladder_stat.loseCount = 0 THEN 0 ELSE ladder_stat.winCount * 100 / (ladder_stat.winCount + ladder_stat.loseCount) END AS winRate',
      ])
      .orderBy(filter, order as 'ASC' | 'DESC')
      .getRawMany();

    // 랭킹이 없으면 빈 배열을 반환한다.
    if (results.length === 0) {
      return [];
    }
    // 랭킹을 반환한다.
    return results.map((result, index) => {
      return {
        ranking: index + 1,
        userInfo: {
          userId: result.userid,
          nickname: result.nickname,
          avatarUrl: result.avatarurl,
        },
        ladderScore: result.ladderscore,
        winCount: result.wincount,
        loseCount: result.losecount,
        winRate: result.winrate,
      } as RankDto;
    }) as RankDto[];
  }

  async getRecentRecord(userId: number): Promise<MyMatchHistoryDto[]> {
    this.logger.debug(`Called ${this.getRecentRecord.name}`);
    // userId로 최근 10개의 매치 기록을 가져온다.
    const results = await this.matchHistoryRepository.find({
      relations: {
        redUser: true,
        blueUser: true,
      },
      // userId가 redUser or blueUser인 것을 찾는다.
      where: [
        {
          redUser: {
            userId,
          },
        },
        {
          blueUser: {
            userId,
          },
        },
      ],
      order: {
        beginDate: 'DESC',
      },
      take: 10,
      select: {
        matchId: true,
        redScore: true,
        blueScore: true,
        beginDate: true,
        endDate: true,
        redUser: {
          userId: true,
          nickname: true,
          avatarUrl: true,
        },
        blueUser: {
          userId: true,
          nickname: true,
          avatarUrl: true,
        },
        matchType: true,
      },
    });

    // 매치 기록이 없으면 빈 배열을 반환한다.
    if (results.length === 0) {
      return [];
    }
    // results를 MyMatchHistoryDto[]로 변환한다.
    const matchHistories: MyMatchHistoryDto[] = results.map((result) => {
      const matchHistory = new MyMatchHistoryDto();
      matchHistory.matchId = result.matchId;

      // userId가 redUser인지 blueUser인지 확인한다.
      if (result.redUser.userId === userId) {
        matchHistory.myScore = result.redScore;
        matchHistory.opponent = result.blueUser;
        matchHistory.opponentScore = result.blueScore;
      } else {
        matchHistory.myScore = result.blueScore;
        matchHistory.opponent = result.redUser;
        matchHistory.opponentScore = result.redScore;
      }
      matchHistory.matchResult =
        matchHistory.myScore > matchHistory.opponentScore
          ? MatchResult.WIN
          : MatchResult.LOSE;
      matchHistory.beginDate = result.beginDate;
      matchHistory.matchTime =
        result.endDate.getTime() - result.beginDate.getTime();
      matchHistory.matchType = result.matchType;
      return matchHistory;
    });
    return matchHistories;
  }

  async getUserLadderStat(userId: number): Promise<GameStatDto> {
    this.logger.debug(`Called ${this.getUserLadderStat.name}`);
    // userId로 ladder_stat을 가져온다.
    const result = await this.ladderStatRepository
      .createQueryBuilder('ladder_stat')
      .select([
        'ladder_stat.ladderScore as ladderScore',
        'ladder_stat.winCount as winCount',
        'ladder_stat.loseCount as loseCount',
        // winCount + loseCount가 0이면 0으로 나누는 에러가 발생하므로
        // winCount + loseCount가 0이면 0으로 설정한다.
        'CASE WHEN ladder_stat.winCount + ladder_stat.loseCount = 0 THEN 0 ELSE ladder_stat.winCount * 100 / (ladder_stat.winCount + ladder_stat.loseCount) END AS winRate',
      ])
      .where('ladder_stat.userId = :userId', { userId })
      .getRawOne();
    if (!result) {
      throw new NotFoundException('해당 유저의 래더 게임 전적이 없습니다.');
    }
    return {
      matchType: MatchType.LADDER,
      winCount: result.wincount,
      loseCount: result.losecount,
      winRate: result.winrate,
    };
  }

  async getUserNormalStat(userId: number): Promise<GameStatDto> {
    this.logger.debug(`Called ${this.getUserNormalStat.name}`);
    // userId로 normal_stat을 가져온다.
    const result = await this.normalStatRepository
      .createQueryBuilder('normal_stat')
      .select([
        'normal_stat.winCount as winCount',
        'normal_stat.loseCount as loseCount',
        // winCount + loseCount가 0이면 0으로 나누는 에러가 발생하므로
        // winCount + loseCount가 0이면 0으로 설정한다.
        'CASE WHEN normal_stat.winCount + normal_stat.loseCount = 0 THEN 0 ELSE normal_stat.winCount * 100 / (normal_stat.winCount + normal_stat.loseCount) END AS winRate',
      ])
      .where('normal_stat.userId = :userId', { userId })
      .getRawOne();
    if (!result) {
      throw new NotFoundException('해당 유저의 일반 게임 전적이 없습니다.');
    }
    return {
      matchType: MatchType.NORMAL,
      winCount: result.wincount,
      loseCount: result.losecount,
      winRate: result.winrate,
    };
  }

  async createMatchHistory(matchHistory: MatchHistoryDto): Promise<void> {
    this.logger.debug(`Called ${this.createMatchHistory.name}`);
    // matchHistory를 저장한다.
    await this.matchHistoryRepository.save(matchHistory);
  }

  async updateWinNormalStat(userId: number): Promise<void> {
    this.logger.debug(`Called ${this.updateWinNormalStat.name}`);
    const data = await this.normalStatRepository.findOne({
      where: { userId },
    });
    if (!data) {
      throw new Error('User not found');
    }
    data.winCount += 1;
    await this.normalStatRepository.update(userId, data);
  }

  async updateLoseNormalStat(userId: number): Promise<void> {
    this.logger.debug(`Called ${this.updateLoseNormalStat.name}`);
    const data = await this.normalStatRepository.findOne({
      where: { userId },
    });
    if (!data) {
      throw new Error('User not found');
    }
    data.loseCount += 1;
    await this.normalStatRepository.update(userId, data);
  }

  async updateWinLadderStat(userId: number, score: number): Promise<void> {
    this.logger.debug(
      `Called ${this.updateWinNormalStat.name} param: {userId: ${userId}, score: ${score}}`,
    );
    const data = await this.ladderStatRepository.findOne({
      where: { userId },
    });
    if (!data) {
      throw new Error('User not found');
    }
    data.winCount += 1;
    data.ladderScore += score;
    await this.ladderStatRepository.update(userId, data);
  }

  async updateLoseLadderStat(userId: number, score: number): Promise<void> {
    this.logger.debug(
      `Called ${this.updateLoseLadderStat.name} param: {userId: ${userId}, score: ${score}}`,
    );
    const data = await this.ladderStatRepository.findOne({
      where: { userId },
    });
    if (!data) {
      throw new Error('User not found');
    }
    data.loseCount += 1;
    data.ladderScore -= score;
    await this.ladderStatRepository.update(userId, data);
  }
}
