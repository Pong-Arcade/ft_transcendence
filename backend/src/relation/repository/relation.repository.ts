import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDto } from 'src/dto/user.dto';
import Relation from 'src/entity/relation.entity';
import { Repository } from 'typeorm';
import { UserRelationDto } from '../../dto/user.relation.dto';
import { UserRelationType } from '../../enum/user.relation.enum';
import { UserBlockListResponseDto } from '../../dto/response/user.block.list.response.dto';
import { UserService } from '../../user/user.service';
import { UserFriendListResponseDto } from '../../dto/response/user.friend.list.response.dto';

export class RelationRepository {
  private logger = new Logger(RelationRepository.name);

  constructor(
    @InjectRepository(Relation)
    private readonly relationRepository: Repository<Relation>,
    private readonly userService: UserService, //  TODO: 하... HELP
  ) {}

  async getBlockList(user: UserDto): Promise<UserBlockListResponseDto> {
    const users = await this.relationRepository.find({
      where: {
        userId: user.userId,
        relationType: UserRelationType.BLOCK,
      },
    });
    if (!users) return null;
    // 각 UserDto 객체를 Promise<UserDto> 객체로 변환하여 배열에 저장
    const userPromises = users.map((rel: Relation) =>
      this.userService.getUserInfo(rel.otherUserId),
    );

    // UserBlockListResponseDto 타입의 객체를 생성하고 반환
    return { blockUsers: await Promise.all(userPromises) };
  }

  async addBlock(relation: UserRelationDto): Promise<void> {
    this.logger.log(`Called ${this.addBlock.name}`);
    await this.relationRepository.save(
      this.relationRepository.create({
        userId: relation.userId,
        otherUserId: relation.targetUserId,
        relationType: UserRelationType.BLOCK,
      }),
    );
  }

  async delBlock(relation: UserRelationDto): Promise<void> {
    this.logger.log(`Called ${this.delBlock.name}`);
    const relations = await this.relationRepository.find({
      where: { userId: relation.userId, relationType: UserRelationType.BLOCK },
    });
    await this.relationRepository.delete(
      relations.find((r) => r.otherUserId === relation.targetUserId),
    );
  }

  async getFriendsList(user: UserDto): Promise<UserFriendListResponseDto> {
    const users = await this.relationRepository.find({
      where: {
        userId: user.userId,
        relationType: UserRelationType.FRIEND,
      },
    });
    if (!users) return null;
    // 각 UserDto 객체를 Promise<UserDto> 객체로 변환하여 배열에 저장
    const userPromises = users.map((rel: Relation) =>
      this.userService.getUserInfo(rel.otherUserId),
    );

    // UserFriendListResponseDto 타입의 객체를 생성하고 반환
    return {
      friendUsers: await Promise.all(userPromises),
    } as UserFriendListResponseDto;
  }

  async addFriend(relation: UserRelationDto): Promise<void> {
    this.logger.log(`Called ${this.addFriend.name}`);
    await this.relationRepository.save(
      this.relationRepository.create({
        userId: relation.userId,
        otherUserId: relation.targetUserId,
        relationType: UserRelationType.FRIEND,
      }),
    );
  }

  async delFriend(relation: UserRelationDto): Promise<void> {
    this.logger.log(`Called ${this.delFriend.name}`);
    const relations = await this.relationRepository.find({
      where: { userId: relation.userId, relationType: UserRelationType.FRIEND },
    });
    await this.relationRepository.delete(
      relations.find((r) => r.otherUserId === relation.targetUserId),
    );
  }
}
