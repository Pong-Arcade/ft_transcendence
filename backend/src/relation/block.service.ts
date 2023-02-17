import { Inject, Injectable, Logger } from '@nestjs/common';
import { RelationRepository } from './repository/relation.repository';
import { UserRelationDto } from '../dto/user.relation.dto';
import { UserDto } from '../dto/user.dto';
import { UserBlockListResponseDto } from '../dto/response/user.block.list.response.dto';

@Injectable()
export class BlockService {
  private logger = new Logger(BlockService.name);
  constructor(
    @Inject(RelationRepository)
    private readonly relationRepository: RelationRepository,
  ) {}

  /**
   * user가 target을 Block.
   * @param userRelationDto
   */
  async getBlocks(user: UserDto): Promise<UserBlockListResponseDto> {
    this.logger.log(`Called ${this.getBlocks.name}`);
    return await this.relationRepository.getBlockList(user);
  }

  async addBlockUser(relation: UserRelationDto): Promise<void> {
    this.logger.log(`Called ${this.addBlockUser.name}`);
    await this.relationRepository.addBlock(relation);
  }

  async delBlockUser(relation: UserRelationDto): Promise<void> {
    this.logger.log(`Called ${this.delBlockUser.name}`);
    await this.relationRepository.delBlock(relation);
  }
}
