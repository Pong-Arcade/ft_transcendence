import { Controller, Get, Logger, Patch, Res, UseGuards } from '@nestjs/common';
import { FtGuard } from './42/ft.guard';
import { User } from 'src/decorator/user.decorator';
import { Response } from 'express';
import { UserDto } from 'src/dto/user.dto';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { JWTSignGuard } from './jwt/jwt.sign.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from './jwt/jwt.auth.guard';

@ApiTags('Auth')
@ApiBearerAuth()
@Controller('/api/auth')
export class AuthController {
  private logger = new Logger(AuthController.name);
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
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
  @UseGuards(FtGuard, JWTSignGuard)
  async loginCallback(@User() user: UserDto, @Res() res: Response) {
    this.logger.log('Login -> callback');

    const find = await this.authService.addUserIfNotExists(user);

    // 유저가 처음 로그인한 경우, lobby 페이지로 redirect 하되, query로 isFirstLogin을 true로 설정한다.
    const feHost = this.configService.get<string>('fe_host');
    if (!find) {
      return res.redirect(`${feHost}/lobby/?isFirstLogin=true`);
    }
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
}
