import { Controller, Get, Logger, Res, UseGuards } from '@nestjs/common';
import { FtGuard } from './42/ft.guard';
import { User } from 'src/decorator/user.decorator';
import { Response } from 'express';
import { UserDto } from 'src/dto/user.dto';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { JWTSignGuard } from './jwt/jwt.sign.guard';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
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

    // 유저가 처음 로그인한 경우, Lobby 페이지로 redirect 하되, query로 isFirstLogin을 true로 설정한다.
    const feHost = this.configService.get<string>('fe_host');
    if (!find) {
      return res.redirect(`${feHost}/Lobby/?isFirstLogin=true`);
    }
    return res.redirect(`${feHost}/Lobby`);
  }
}
