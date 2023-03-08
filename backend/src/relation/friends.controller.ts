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
import { User } from '../decorator/user.decorator';
import { UserDto } from '../dto/user.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserFriendListResponseDto } from '../dto/response/user.friend.list.response.dto';
import { FriendsService } from './friends.service';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.auth.guard';

@ApiTags('Relation')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/friends')
export class FriendsController {
  private logger = new Logger(FriendsController.name);
  constructor(private readonly friendService: FriendsService) {}
  @ApiOperation({
    summary: '유저의 친구 목록',
    description: '해당 유저의 모든 친구정보를 불러옵니다.',
  })
  @ApiResponse({
    status: 200,
    description: '전체 친구 목록',
    type: UserFriendListResponseDto,
  })
  @Get()
  async getFriend(@User() user: UserDto) {
    this.logger.log(`Called ${this.getFriend.name}`);
    return await this.friendService.getFriends(user);
  }

  @Patch(':user_id')
  @HttpCode(200)
  @ApiOperation({
    summary: '친구 추가',
    description: '유저를 친구 추가합니다.',
  })
  @ApiResponse({
    status: 400,
    description: '잘못된 요청입니다.',
  })
  @ApiResponse({
    status: 404,
    description: '존재하지 않는 유저입니다.',
  })
  @ApiResponse({
    status: 409,
    description:
      '자기 자신을 친구로 추가할 수 없습니다. or 이미 친구로 추가된 유저입니다',
  })
  async addFriend(@User() user: UserDto, @Param('user_id') userId: number) {
    this.logger.log(`Called ${this.addFriend.name}`);
    await this.friendService.addFriend({
      userId: user.userId,
      targetUserId: userId,
    });
  }

  @Delete(':user_id')
  @HttpCode(204)
  @ApiOperation({
    summary: '친구 삭제',
    description: '유저의 친구를 삭제합니다.',
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
    description: '친구로 등록되지 않은 유저입니다.',
  })
  async delFriend(@User() user: UserDto, @Param('user_id') userId: number) {
    this.logger.log(`Called ${this.delFriend.name}`);
    await this.friendService.delFriend({
      userId: user.userId,
      targetUserId: userId,
    });
  }
}
