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
  async getAllUsers(): Promise<OnlineUsersResponseDto> {
    this.logger.log(`Called ${this.getAllUsers.name}`);
    const response = new OnlineUsersResponseDto();
    response.onlineUsers = await this.userService.getAllUsers();
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
    description: '존재하지 않는 유저입니다.',
  })
  @Get(':user_id')
  async getUserDetail(
    @Param('user_id', ParseIntPipe) userId: number,
  ): Promise<UserDetailResponseDto> {
    this.logger.log(`Called ${this.getUserDetail.name}`);
    return await this.userService.getUserDetail(userId);
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
      await this.cacheManager.set(`user-${user.userId}`, userInfo, 60 * 10);

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
