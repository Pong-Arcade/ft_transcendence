import { Controller, Get, HttpCode, Logger, Param } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from 'src/decorator/user.decorator';
import { UserDto } from 'src/dto/user.dto';
import { OnlineUsersResponseDto } from '../dto/response/online.users.response.dto';
import { ChatGateway } from '../chat/chat.geteway';
import { GameGateway } from '../game/game.gateway';

const onlineUsers: OnlineUsersResponseDto = {
  onlineUsers: [
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
const userInfo = {
  userId: 1,
  nickname: 'sichoi',
  ladderInfo: {
    ladderScore: 1020,
    rank: 13,
    winCount: 3,
    loseCount: 2,
    winRate: 60,
    userStatus: 'ON_LOBBY',
  },
  normalInfo: {
    winCount: 3,
    loseCount: 2,
    winRate: 60,
    userStatus: 'ON_LOBBY',
  },
};

@ApiTags('Users')
@Controller('/api/users')
export class UserController {
  private logger = new Logger(UserController.name);

  constructor(
    private chatGateway: ChatGateway,
    private gameGateway: GameGateway,
  ) {}

  @ApiOperation({
    summary: '모든 온라인 유저 배열 반환',
    description: '현재 접속중인 모든 온라인 유저 정보 배열을 반환',
  })
  @Get()
  @HttpCode(200)
  async getAllUsers() {
    this.logger.log(`Called ${this.getAllUsers.name}`);
    return onlineUsers;
  }

  @ApiOperation({
    summary: '유저의 상세 정보',
    description: '특정 유저의 상세 정보를 불러옵니다.',
  })
  @Get(':user_id')
  async getUserDetail(@User() user: UserDto) {
    this.logger.log(`Called ${this.getUserDetail.name}`);
    return userInfo;
  }
}
