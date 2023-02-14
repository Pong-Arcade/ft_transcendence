import {
  Controller,
  Delete,
  Get,
  HttpCode,
  Logger,
  Param,
  Patch,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from '../decorator/user.decorator';
import { UserDto } from '../dto/user.dto';
import { MockRepository } from '../mock/mock.repository';

@ApiTags('Relation')
@Controller('api/block')
export class BlockController {
  private logger = new Logger(BlockController.name);
  private mock = new MockRepository();

  @ApiOperation({
    summary: '유저의 차단 목록',
    description: '해당 유저가 차단한 유저들의 목록을 제공합니다.',
  })
  @Get()
  @HttpCode(200)
  async getBlocks(@User() user: UserDto) {
    this.logger.log(`Called ${this.getBlocks.name}`);
    return this.mock.getBlockUser(34);
  }

  @ApiOperation({
    summary: '차단 등록',
    description: '유저를 차단합니다.',
  })
  @Patch(':user_id')
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
