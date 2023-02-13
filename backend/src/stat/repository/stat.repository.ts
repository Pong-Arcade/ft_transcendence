import { Logger } from '@nestjs/common';
import { IStatRepository } from './stat.repository.interface';
import { InjectRepository } from '@nestjs/typeorm';
import MatchHistory from 'src/entity/match.history.entity';
import { Repository } from 'typeorm';
import { MatchHistoryDto } from 'src/dto/match.history.dto';
import { MatchResult } from 'src/enum/match.result.enum';

export class StatRepository implements IStatRepository {
  private logger = new Logger(StatRepository.name);
  constructor(
    @InjectRepository(MatchHistory)
    private readonly matchHistoryRepository: Repository<MatchHistory>,
  ) {}
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

    // 매치 기록이 없으면 null을 반환한다.
    if (results.length === 0) {
      return null;
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
