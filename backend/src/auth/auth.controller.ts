import {
  Controller,
  Get,
  Logger,
  Param,
  Patch,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { FtGuard } from './42/ft.guard';
import { User } from 'src/decorator/user.decorator';
import { Response } from 'express';
import { UserDto } from 'src/dto/user.dto';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from './jwt/jwt.auth.guard';
import { JwtService } from '@nestjs/jwt';

@ApiTags('Auth')
@ApiBearerAuth()
@Controller('/api/auth')
export class AuthController {
  private logger = new Logger(AuthController.name);
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  @ApiOperation({ summary: '로그인', description: '42로그인 페이지로 이동' })
  @Get('login')
  @UseGuards(FtGuard)
  login() {
    this.logger.log('Cannot be reached');
  }

  @ApiOperation({
    summary: '로그인 콜백 URL',
    description: '로그인 성공 시 리다이렉트 후 메인으로 이동',
  })
  @Get('login/callback')
  @UseGuards(FtGuard)
  async loginCallback(@User() user: UserDto, @Res() res: Response) {
    this.logger.log('Login -> callback');
    const [userInfo, isFirstLogin] = await this.authService.addUserIfNotExists(
      user,
    );

    const feHost = this.configService.get<string>('fe_host');

    // 2차 인증을 등록한 유저라면, 2차 인증 페이지로 redirect 한다.
    if (userInfo.is2FA) {
      // TODO: 인증 이메일 발송
      return res.redirect(`${feHost}/2FA`);
    }

    // 토큰을 생성하고, 쿠키에 저장한다.
    const token = this.jwtService.sign({
      userId: user.userId,
      nickname: user.nickname,
    });
    const expires = new Date(this.jwtService.decode(token)['exp'] * 1000);
    const domain = this.configService
      .get<string>('fe_host')
      .replace('http://', '');
    this.logger.debug(`${user.nickname}의 토큰을 생성합니다.`);
    res.cookie(this.configService.get<string>('jwt.token'), token, {
      expires,
      domain,
    });

    // 유저가 처음 로그인한 경우, lobby 페이지로 redirect 하되, query로 isFirstLogin을 true로 설정한다.
    if (isFirstLogin) {
      return res.redirect(`${feHost}/lobby/?isFirstLogin=true`);
    }

    // 그 외의 경우, 2차 인증키 값을 갱신하고, lobby 페이지로 redirect 한다.
    await this.authService.enroll2FA(user.userId);
    return res.redirect(`${feHost}/lobby`);
  }

  @ApiOperation({
    summary: '2차 인증 등록 요청',
    description:
      '2차 인증 등록을 요청합니다. 가지고 있는 토큰이 삭제되며, 다시 로그인해야 합니다.',
  })
  @Patch('enroll/2FA')
  @UseGuards(JwtAuthGuard)
  async enroll2FA(@User() user: UserDto, @Res() res: Response) {
    this.logger.log(`Called ${this.enroll2FA.name}`);
    await this.authService.enroll2FA(user.userId);
    res.clearCookie(
      this.configService.get<string>('fe_host').replace('http://', ''),
    );
  }

  @ApiOperation({
    summary: '2차 인증 수행',
    description:
      '2차 인증을 수행합니다. param으로 받은 값과 DB에 저장된 값이 일치해야 합니다.',
  })
  @Patch('verify/2FA')
  async verify2FA(@Param('access') access: string): Promise<{ token: string }> {
    this.logger.log(`Called ${this.verify2FA.name}`);
    const userInfo = await this.authService.verify2FA(access);
    if (!userInfo) {
      throw new UnauthorizedException('2FA 인증에 실패했습니다.');
    }
    // 토큰 발행
    const token = this.jwtService.sign({
      userId: userInfo.userId,
      nickname: userInfo.nickname,
    });
    return { token };
  }
}
