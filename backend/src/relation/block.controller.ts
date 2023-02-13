import {
  Controller,
  Delete,
  Get,
  HttpCode,
  Logger,
  Param,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from '../decorator/user.decorator';
import { UserDto } from '../dto/user.dto';
import { UserBlockListResponseDto } from '../dto/response/user.block.list.response.dto';

const blockUsers: UserBlockListResponseDto = {
  blockUsers: [
    {
      userId: 1,
      nickname: 'youngpar',
      avatarUrl: 'qwe.jpeg',
      email: 'qwe@asd.com',
    },
    {
      userId: 2,
      nickname: 'youngpar2',
      avatarUrl: 'qwe2.jpeg',
      email: 'qwe2@asd.com',
    },
  ],
  isLast: true,
};

@ApiTags('Relation')
@Controller('api/block')
export class BlockController {
  private logger = new Logger(BlockController.name);

  @ApiOperation({
    summary: '유저의 차단 목록',
    description: '해당 유저가 차단한 유저들의 목록을 제공합니다.',
  })
  @Get(':user_id')
  @HttpCode(200)
  async getBlocks(@User() user: UserDto) {
    this.logger.log(`Called ${this.getBlocks.name}`);
    return blockUsers;
  }

  @ApiOperation({
    summary: '차단 등록',
    description: '유저를 차단합니다.',
  })
  @Post(':user_id')
  @HttpCode(201)
  async addBlock(@User() user: UserDto, @Param('user_id') userId: number) {
    this.logger.log(`Called ${this.addBlock.name}`);
    //  TODO: Business Logic!
  }

  @ApiOperation({
    summary: '차단 해제',
    description: '차단된 유저를 해제합니다.',
  })
  @Delete(':user_id')
  @HttpCode(204)
  async delBlock(@User() user: UserDto, @Param('user_id') userId: number) {
    this.logger.log(`Called ${this.delBlock.name}`);
    //  TODO: Business Logic!
  }
}
