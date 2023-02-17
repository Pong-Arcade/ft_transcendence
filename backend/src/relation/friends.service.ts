import { Inject, Injectable, Logger } from '@nestjs/common';
import { RelationRepository } from './repository/relation.repository';
import { UserRelationDto } from '../dto/user.relation.dto';
import { UserDto } from '../dto/user.dto';
import { UserFriendListResponseDto } from '../dto/response/user.friend.list.response.dto';

@Injectable()
export class FriendsService {
  private logger = new Logger(FriendsService.name);
  constructor(
    @Inject(RelationRepository)
    private readonly relationRepository: RelationRepository,
  ) {}

  /**
   * user가 target을 친구 추가.
   * @param userRelationDto
   */
  async getFriends(user: UserDto): Promise<UserFriendListResponseDto> {
    this.logger.log(`Called ${this.getFriends.name}`);
    return await this.relationRepository.getFriendsList(user);
  }

  async addFriend(relation: UserRelationDto): Promise<void> {
    this.logger.log(`Called ${this.addFriend.name}`);
    await this.relationRepository.addFriend(relation);
  }

  async delFriend(relation: UserRelationDto): Promise<void> {
    this.logger.log(`Called ${this.delFriend.name}`);
    await this.relationRepository.delFriend(relation);
  }
}
