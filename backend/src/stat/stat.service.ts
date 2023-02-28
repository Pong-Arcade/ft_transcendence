import {
  forwardRef,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { IStatRepository } from './repository/stat.repository.interface';
import { UserRecentMatchHistoryResponseDto } from 'src/dto/response/user.recent.match.history.response.dto';
import { UserService } from 'src/user/user.service';
import { RankListResponseDto } from 'src/dto/response/rank.list.response.dto';
import { RankingFilter } from 'src/enum/ranking.filter.enum';
import { SortDirection } from 'src/enum/sort.direction.enum';

@Injectable()
export class StatService {
  private logger = new Logger(StatService.name);

  constructor(
    @Inject('IStatRepository')
    private readonly statRepository: IStatRepository,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}

  async getRanking(
    filter: RankingFilter,
    order: SortDirection,
  ): Promise<RankListResponseDto> {
    this.logger.log(`Called ${this.getRanking.name}`);
    const rankList = await this.statRepository.getRanking(filter, order);
    return {
      rankList: rankList,
    } as RankListResponseDto;
  }

  async getRecentRecord(
    userId: number,
  ): Promise<UserRecentMatchHistoryResponseDto> {
    this.logger.log(`Called ${this.getRecentRecord.name}`);
    const userInfo = await this.userService.getUserInfo(userId);
    if (!userInfo) {
      throw new NotFoundException('존재하지 않는 유저입니다.');
    }
    const matchHistories = await this.statRepository.getRecentRecord(userId);
    return {
      userInfo,
      matchHistories,
    } as UserRecentMatchHistoryResponseDto;
  }
}
