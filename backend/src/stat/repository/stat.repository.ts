import { Logger } from '@nestjs/common';
import { IStatRepository } from './stat.repository.interface';
import { InjectRepository } from '@nestjs/typeorm';
import MatchHistory from 'src/entity/match.history.entity';
import { Repository } from 'typeorm';
import { MatchHistoryDto } from 'src/dto/match.history.dto';
import { MatchResult } from 'src/enum/match.result.enum';
import { RankDto } from 'src/dto/rank.dto';
import LadderStat from 'src/entity/ladder.stat.entity';
import { RankingFilter } from 'src/enum/ranking.filter.enum';
import { SortDirection } from 'src/enum/sort.direction.enum';

export class StatRepository implements IStatRepository {
  private logger = new Logger(StatRepository.name);
  constructor(
    @InjectRepository(MatchHistory)
    private readonly matchHistoryRepository: Repository<MatchHistory>,

    @InjectRepository(LadderStat)
    private readonly ladderStatRepository: Repository<LadderStat>,
  ) {}

  async getRanking(
    filter: RankingFilter,
    order: SortDirection,
  ): Promise<RankDto[]> {
    this.logger.log(`Called ${this.getRanking.name}`);
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
        '(ladder_stat.winCount * 100 / (ladder_stat.winCount + ladder_stat.loseCount)) AS winRate',
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

  async getRecentRecord(userId: number): Promise<MatchHistoryDto[]> {
    this.logger.log(`Called ${this.getRecentRecord.name}`);
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
    // results를 MatchHistoryDto[]로 변환한다.
    const matchHistories: MatchHistoryDto[] = results.map((result) => {
      const matchHistory = new MatchHistoryDto();
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
}
