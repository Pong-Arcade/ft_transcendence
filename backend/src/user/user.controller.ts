import {
  Controller,
  Get,
  HttpCode,
  Logger,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { User } from 'src/decorator/user.decorator';
import { UserDto } from 'src/dto/user.dto';
import { ChatGateway } from '../chat/chat.geteway';
import { GameGateway } from '../game/game.gateway';
import { MockRepository } from '../mock/mock.repository';
import { OnlineUsersResponseDto } from '../dto/response/online.users.response.dto';
import { UserService } from './user.service';

@ApiTags('Users')
@Controller('/api/users')
export class UserController {
  private logger = new Logger(UserController.name);
  private mock = new MockRepository();
  constructor(
    private chatGateway: ChatGateway,
    private gameGateway: GameGateway,
    private readonly userService: UserService,
  ) {}

  @ApiOperation({
    summary: '모든 온라인 유저 배열 반환',
    description: '현재 접속중인 모든 온라인 유저 정보 배열을 반환',
  })
  @ApiResponse({
    status: 200,
    description: '전체 유저 목록 정보(접속중인 유저)',
    type: OnlineUsersResponseDto,
  })
  @Get()
  async getAllUsers() {
    this.logger.log(`Called ${this.getAllUsers.name}`);
    return this.mock.getOnlineUser();
  }

  @ApiOperation({
    summary: '유저의 상세 정보',
    description: '특정 유저의 상세 정보를 불러옵니다.',
  })
  @ApiResponse({
    status: 200,
    description: '전체 유저 목록 정보(접속중인 유저)',
    type: OnlineUsersResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: '잘못된 요청입니다.',
  })
  @ApiResponse({
    status: 404,
    description: '존재하지 않는 유저입니다.',
  })
  @Get(':user_id')
  async getUserDetail(
    @User() user: UserDto,
    @Param('user_id', ParseIntPipe) userId: number,
  ) {
    this.logger.log(`Called ${this.getUserDetail.name}`);
    return await this.userService.getUserInfo(userId);
  }
}
