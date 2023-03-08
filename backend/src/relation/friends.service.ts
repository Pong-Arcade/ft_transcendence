import {
  ConflictException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { UserRelationDto } from '../dto/user.relation.dto';
import { UserDto } from '../dto/user.dto';
import { UserFriendListResponseDto } from '../dto/response/user.friend.list.response.dto';
import { InjectRepository } from '@nestjs/typeorm';
import Relation from 'src/entity/relation.entity';
import { Repository } from 'typeorm';
import { UserRelationType } from 'src/enum/user.relation.enum';
import { UserService } from 'src/user/user.service';
import { StatusService } from 'src/status/status.service';

@Injectable()
export class FriendsService {
  private logger = new Logger(FriendsService.name);
  constructor(
    @InjectRepository(Relation)
    private readonly relationRepository: Repository<Relation>,
    private readonly userService: UserService,
    @Inject('StatusService')
    private readonly statusService: StatusService,
  ) {}

  /**
   * user가 target을 친구 추가.
   * @param userRelationDto
   */
  async getFriends(user: UserDto): Promise<UserFriendListResponseDto> {
    this.logger.debug(`Called ${this.getFriends.name}`);
    const results = await this.relationRepository.find({
      where: {
        user: {
          userId: user.userId,
        },
        relationType: UserRelationType.FRIEND,
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
    const friends: UserFriendListResponseDto['friendUsers'] = results.map(
      (result) => {
        return {
          userId: result.targetUser.userId,
          nickname: result.targetUser.nickname,
          avatarUrl: result.targetUser.avatarUrl,
        };
      },
    );
    friends.forEach((friend) => {
      const user = this.statusService.getUserSocketInfoByUserId(friend.userId);
      if (user) friend.location = user.location;
    });

    return {
      friendUsers: friends,
    };
  }

  async addFriend(relation: UserRelationDto): Promise<void> {
    this.logger.debug(`Called ${this.addFriend.name}`);
    if (relation.userId === relation.targetUserId) {
      throw new ConflictException('자기 자신을 친구로 추가할 수 없습니다.');
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
      if (find.relationType === UserRelationType.FRIEND) {
        throw new ConflictException('이미 친구로 추가된 유저입니다.');
      }
      // 차단된 유저를 친구로 추가할 경우 차단을 해제하고 친구로 추가한다.
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
          relationType: UserRelationType.FRIEND,
        },
      );
      // 관계가 존재하지 않는 경우 친구로 추가한다.
    } else {
      await this.relationRepository.insert({
        user: {
          userId: relation.userId,
        },
        targetUser: {
          userId: relation.targetUserId,
        },
        relationType: UserRelationType.FRIEND,
      });
    }
  }

  async delFriend(relation: UserRelationDto): Promise<void> {
    this.logger.debug(`Called ${this.delFriend.name}`);
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
      relationType: UserRelationType.FRIEND,
    });
    if (result.affected === 0) {
      throw new ConflictException('친구로 등록되지 않은 유저입니다.');
    }
  }
}
