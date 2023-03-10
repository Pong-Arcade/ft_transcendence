import {
  Body,
  CACHE_MANAGER,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Logger,
  Param,
  ParseIntPipe,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { User } from 'src/decorator/user.decorator';
import { UserDto } from 'src/dto/user.dto';
import { OnlineUsersResponseDto } from '../dto/response/online.users.response.dto';
import { UserService } from './user.service';
import { UpdateUserInfoRequestDto } from 'src/dto/request/update.user.info.request.dto';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Cache } from 'cache-manager';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { existsSync, mkdirSync } from 'fs';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.auth.guard';
import { v4 as uuid } from 'uuid';
import { UserDetailResponseDto } from '../dto/response/user.detail.response.dto';
import { users } from 'src/status/status.module';
import { gameRooms } from 'src/game/gameroom.service';
import { userCheckDto } from 'src/dto/user.check.dto';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('/api/users')
export class UserController {
  private logger = new Logger(UserController.name);
  constructor(
    private readonly userService: UserService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private jwtService: JwtService,
    @Inject(ConfigService) private configService: ConfigService,
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
  getAllOnlineUsers(): OnlineUsersResponseDto {
    this.logger.log(`Called ${this.getAllOnlineUsers.name}`);
    const response = new OnlineUsersResponseDto();
    response.onlineUsers = this.userService.getAllOnlineUsers();
    return response;
  }

  @ApiOperation({
    summary: '유저의 상세 정보',
    description: '특정 유저의 상세 정보를 불러옵니다.',
  })
  @ApiResponse({
    status: 200,
    description: '전체 유저 목록 정보(접속중인 유저)',
    type: UserDetailResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: '잘못된 요청입니다.',
  })
  @ApiResponse({
    status: 404,
    description:
      '존재하지 않는 유저이거나 래더/일반 게임 전적이 존재하지 않습니다.',
  })
  @Get(':user_id')
  async getUserDetail(
    @Param('user_id', ParseIntPipe) userId: number,
  ): Promise<UserDetailResponseDto> {
    this.logger.log(`Called ${this.getUserDetail.name}`);
    return await this.userService.getUserDetail(userId);
  }

  @Post('/check/:userId/:location')
  checkLocation(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('location') location: string,
    @Body('roomId') roomId?: number,
  ): userCheckDto {
    console.log(userId, location, roomId);
    const user = users.get(userId);
    let ret: { url: string; method: string; url2?: string; method2?: string } =
      new userCheckDto();
    // lobby
    if (location.slice(0, 4) === 'lobb') {
      ret.method = 'delete';
      console.log('ret:', ret);
      //채팅방에 있던 경우
      if (user.location > 0) {
        ret.url = `chat-rooms/leave/${user.location}`;
        return ret;
      }
      const gameRoom = gameRooms.get(user.location * -1);
      //게임방 관전자로 있던 경우
      if (gameRoom.spectatorUsers.includes(userId))
        ret.url = `game-rooms/spectate/leave/${user.location * -1}`;
      //게임방 플레이어로 있던 경우
      else ret.url = `game-rooms/leave/${user.location * -1}`;
    } else if (location.slice(0, 4) === 'chat') {
      if (user.location === 0) {
        ret.url = `chat-rooms/join/${roomId}`;
        ret.method = 'post';
      } else if (user.location < 0) {
        const gameRoom = gameRooms.get(user.location * -1);
        if (gameRoom.spectatorUsers.includes(userId)) {
          ret.url = `game-rooms/spectate/leave/${user.location * -1}`;
          ret.method = 'delete';
          ret.url2 = `chat-rooms/join/${roomId}`;
          ret.method2 = 'post';
        } else {
          ret.url = `game-rooms/leave/${user.location * -1}`;
          ret.method = 'delete';
          ret.url2 = `chat-rooms/join/${roomId}`;
          ret.method2 = 'post';
        }
      }
    } else if (location.slice(0, 4) === 'game') {
      console.log(gameRooms);
      const gameRoom = gameRooms.get(Number(roomId));
      console.log(gameRoom);
      if (user.location == 0) {
        ret.url = `game-rooms/spectator/join/${roomId}`;
        ret.method = 'post';
      } else if (user.location > 0) {
        ret.url = `chat-rooms/leave/${user.location}`;
        ret.method = 'delete';
        console.log('1: ', ret);
        ret.method2 = 'post';

        console.log('2: ', ret);
        if (gameRoom.blueUser) ret.url2 = `game-rooms/spectator/join/${roomId}`;
        else ret.url2 = `game-rooms/join/${roomId}`;
      }
    }
    console.log('return: ', ret);
    return ret;
  }

  @ApiOperation({
    summary: '유저 정보 업데이트',
    description:
      '유저 정보를 업데이트합니다. 닉네임 혹은 아바타 이미지를 변경할 수 있습니다.',
  })
  @ApiResponse({
    status: 201,
    description: '유저 정보 업데이트에 성공했습니다.',
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
    description: '이미 존재하는 닉네임입니다.',
  })
  @HttpCode(201)
  @Post('update')
  @UseInterceptors(
    FileInterceptor('avatarImage', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const path = `uploads`;
          if (!existsSync(path)) {
            mkdirSync(path);
          }
          cb(null, path);
        },
        filename: (req, file, cb) => {
          cb(null, `${uuid()}.${file.mimetype.split('/')[1]}`);
        },
      }),
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: UpdateUserInfoRequestDto,
  })
  async updateUserInfo(
    @User() user: UserDto,
    @Res() res: Response,
    @UploadedFile() avatarImage?: any,
    @Body('nickname') newNickname?: string,
  ): Promise<void> {
    this.logger.log(`Called ${this.updateUserInfo.name}`);
    let newAvatarUrl: string;

    // 아바타 이미지가 변경된 경우, 파일 경로를 저장합니다.
    if (avatarImage) {
      newAvatarUrl = `${this.configService.get<string>('be_host')}/${
        avatarImage.path
      }`;
    }

    const userInfo = await this.userService.updateUserInfo(
      user.userId,
      newNickname,
      newAvatarUrl,
    );
    // nickname이 변경된 경우, JWT 토큰을 재발급하고, 캐싱된 유저 정보를 업데이트합니다.
    if (newNickname) {
      await this.cacheManager.set(
        `user-${user.userId}`,
        userInfo,
        60 * 10 * 1000,
      );

      const token = this.jwtService.sign({
        userId: user.userId,
        nickname: newNickname,
      });
      const expires = new Date(this.jwtService.decode(token)['exp'] * 1000);
      const domain = this.configService
        .get<string>('fe_host')
        .replace('http://', '');
      res.cookie(this.configService.get<string>('jwt.token'), token, {
        expires,
        domain,
      });
    }
    res.status(HttpStatus.CREATED).send();
  }
}
