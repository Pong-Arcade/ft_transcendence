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
import { MockRepository } from '../mock/mock.repository';
import { UserBlockListResponseDto } from '../dto/response/user.block.list.response.dto';

@ApiTags('Relation')
@Controller('api/block')
export class BlockController {
  private logger = new Logger(BlockController.name);
  private mock = new MockRepository();

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
    return this.mock.getBlockUser(34);
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
    //  TODO: Business Logic!
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
    //  TODO: Business Logic!
  }
}
