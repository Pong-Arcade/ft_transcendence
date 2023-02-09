import { Controller, Get, Logger, Req, Res, UseGuards } from '@nestjs/common';
import { FtGuard } from './42/ft.guard';
import { User } from 'src/decorator/user.decorator';
import { Request, Response } from 'express';
import { UserDto } from 'src/dto/user.dto';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from './jwt/jwt.auth.guard';
import { JWTSignGuard } from './jwt/jwt.sign.guard';

@Controller('/api/auth')
export class AuthController {
  private logger = new Logger(AuthController.name);
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Get('login')
  @UseGuards(FtGuard)
  login() {
    this.logger.log('Cannot be reached');
  }

  @Get('login/callback')
  @UseGuards(FtGuard, JWTSignGuard)
  async loginCallback(@User() user: UserDto, @Res() res: Response) {
    this.logger.log('Login -> callback');

    const find = await this.authService.addUserIfNotExists(user);

    // 유저가 처음 로그인한 경우, Lobby 페이지로 redirect 하되, query로 isFirstLogin을 true로 설정한다.
    const feHost = this.configService.get<string>('fe_host');
    if (!find) {
      return res.redirect(`${feHost}/Lobby/?isFirstLogin=true`);
    }
    return res.redirect(`${feHost}/Lobby`);
  }

  @Get('logout')
  @UseGuards(JwtAuthGuard)
  // TODO: 200 OK를 보내도록 하고, 클라이언트는 이를 받으면 쿠키를 삭제하고 로그인 페이지로 리다이렉트하도록 구현
  logout(@Req() req: Request) {
    this.logger.log('Logout');
  }
}
