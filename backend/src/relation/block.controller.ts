import {
  Controller,
  Delete,
  Get,
  HttpCode,
  Logger,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { User } from '../decorator/user.decorator';
import { UserDto } from '../dto/user.dto';
import { UserBlockListResponseDto } from '../dto/response/user.block.list.response.dto';
import { BlockService } from './block.service';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.auth.guard';

@ApiTags('Relation')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
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
    return await this.blockService.getBlocks(user);
  }

  @Patch(':user_id')
  @HttpCode(200)
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
    description: '자기 자신을 차단할 수 없습니다. or 이미 차단한 유저입니다',
  })
  async addBlock(@User() user: UserDto, @Param('user_id') userId: number) {
    this.logger.log(`Called ${this.addBlock.name}`);
    await this.blockService.addBlockUser({
      userId: user.userId,
      targetUserId: userId,
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
  @ApiResponse({
    status: 409,
    description: '차단하지 않은 유저입니다',
  })
  async delBlock(@User() user: UserDto, @Param('user_id') userId: number) {
    this.logger.log(`Called ${this.delBlock.name}`);
    await this.blockService.delBlockUser({
      userId: user.userId,
      targetUserId: userId,
    });
  }
}
