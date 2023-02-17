import {
  Controller,
  Delete,
  Get,
  HttpCode,
  Logger,
  Param,
  Patch,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from '../decorator/user.decorator';
import { UserDto } from '../dto/user.dto';
import { UserBlockListResponseDto } from '../dto/response/user.block.list.response.dto';
import { BlockService } from './block.service';
import { UserFriendListResponseDto } from '../dto/response/user.friend.list.response.dto';

@ApiTags('Relation')
@Controller('api/block')
export class BlockController {
  private logger = new Logger(BlockController.name);
  constructor(private blockService: BlockService) {}

  @ApiOperation({
    summary: '유저의 차단 목록',
    description: '해당 유저가 차단한 유저들의 목록을 제공합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '전체 차단 목록',
    type: UserBlockListResponseDto,
  })
  @Get()
  async getBlocks(@User() user: UserDto) {
    this.logger.log(`Called ${this.getBlocks.name}`);
    return this.blockService.getBlocks(user);
  }

  @Patch(':user_id')
  @HttpCode(201)
  @ApiOperation({
    summary: '차단 등록',
    description: '유저를 차단합니다.',
  })
  @ApiResponse({
    status: 400,
    description: '잘못된 요청입니다',
  })
  @ApiResponse({
    status: 404,
    description: '존재하지 않는 유저입니다',
  })
  @ApiResponse({
    status: 409,
    description: '이미 차단한 유저입니다',
  })
  async addBlock(@User() user: UserDto, @Param('user_id') userId: number) {
    this.logger.log(`Called ${this.addBlock.name}`);
    await this.blockService.addBlockUser({
      user: user.userId,
      target: userId,
    });
  }

  @Delete(':user_id')
  @HttpCode(204)
  @ApiOperation({
    summary: '차단 해제',
    description: '차단된 유저를 해제합니다.',
  })
  @ApiResponse({
    status: 400,
    description: '잘못된 요청입니다',
  })
  @ApiResponse({
    status: 404,
    description: '존재하지 않는 유저입니다',
  })
  async delBlock(@User() user: UserDto, @Param('user_id') userId: number) {
    this.logger.log(`Called ${this.delBlock.name}`);
    await this.blockService.delBlockUser({
      user: user.userId,
      target: userId,
    });
  }

  @ApiOperation({ summary: '차단 테스트' })
  @Get('test')
  async testBlock() {
    this.logger.log(`Block Test Start`);
    //  given
    const testUser: UserDto = {
      userId: 1,
      nickname: 'youngpar',
    };
    this.logger.debug(`When ${this.addBlock.name}(${testUser}, 3, 5)`);
    await this.addBlock(testUser, 3);
    await this.addBlock(testUser, 5);
    //  when : 1번 유저의 친구 목록에 2번, 4번 유저 추가
    const relation: UserBlockListResponseDto =
      await this.blockService.getBlocks(testUser);
    //  then : 1번 유저(testUser)의 차단목록 얻어옴
    this.logger.debug(`Then ${this.getBlocks.name} =>`, relation);
    this.logger.log(`Block Test End`);
    return relation;
  }
}
