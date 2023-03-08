import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { UserRelationDto } from '../dto/user.relation.dto';
import { UserDto } from '../dto/user.dto';
import { UserBlockListResponseDto } from '../dto/response/user.block.list.response.dto';
import { InjectRepository } from '@nestjs/typeorm';
import Relation from 'src/entity/relation.entity';
import { Repository } from 'typeorm';
import { UserRelationType } from 'src/enum/user.relation.enum';
import { UserService } from 'src/user/user.service';

@Injectable()
export class BlockService {
  private logger = new Logger(BlockService.name);
  constructor(
    @InjectRepository(Relation)
    private readonly relationRepository: Repository<Relation>,
    private readonly userService: UserService,
  ) {}

  /**
   * user가 target을 Block.
   * @param userRelationDto
   */
  async getBlocks(user: UserDto): Promise<UserBlockListResponseDto> {
    this.logger.debug(`Called ${this.getBlocks.name}`);
    const results = await this.relationRepository.find({
      where: {
        user: {
          userId: user.userId,
        },
        relationType: UserRelationType.BLOCK,
      },
      relations: {
        targetUser: true,
      },
      select: {
        targetUser: {
          userId: true,
          nickname: true,
          avatarUrl: true,
        },
      },
    });
    const blocks = results.map((result) => {
      return {
        userId: result.targetUser.userId,
        nickname: result.targetUser.nickname,
        avatarUrl: result.targetUser.avatarUrl,
      };
    });
    return {
      blockUsers: blocks,
    };
  }

  async addBlockUser(relation: UserRelationDto): Promise<void> {
    this.logger.debug(`Called ${this.addBlockUser.name}`);
    if (relation.userId === relation.targetUserId) {
      throw new ConflictException('자기 자신을 차단할 수 없습니다.');
    }

    const findUser = await this.userService.getUserInfo(relation.targetUserId);
    if (!findUser) {
      throw new NotFoundException('존재하지 않는 유저입니다.');
    }

    const find = await this.relationRepository.findOne({
      where: {
        user: {
          userId: relation.userId,
        },
        targetUser: {
          userId: relation.targetUserId,
        },
      },
    });

    if (find) {
      if (find.relationType === UserRelationType.BLOCK) {
        throw new ConflictException('이미 차단한 유저입니다.');
      }
      // 친구로 추가한 유저를 차단하는 경우 친구 관계를 삭제하고 차단으로 변경한다.
      await this.relationRepository.update(
        {
          user: {
            userId: relation.userId,
          },
          targetUser: {
            userId: relation.targetUserId,
          },
        },
        {
          relationType: UserRelationType.BLOCK,
        },
      );
      // 관계가 존재하지 않는 경우 차단으로 추가한다.
    } else {
      await this.relationRepository.insert({
        user: {
          userId: relation.userId,
        },
        targetUser: {
          userId: relation.targetUserId,
        },
        relationType: UserRelationType.BLOCK,
      });
    }
  }

  async delBlockUser(relation: UserRelationDto): Promise<void> {
    this.logger.debug(`Called ${this.delBlockUser.name}`);
    const findUser = await this.userService.getUserInfo(relation.targetUserId);
    if (!findUser) {
      throw new NotFoundException('존재하지 않는 유저입니다.');
    }

    const result = await this.relationRepository.delete({
      user: {
        userId: relation.userId,
      },
      targetUser: {
        userId: relation.targetUserId,
      },
      relationType: UserRelationType.BLOCK,
    });
    if (result.affected === 0) {
      throw new ConflictException('차단하지 않은 유저입니다.');
    }
  }
}
