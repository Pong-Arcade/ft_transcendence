import { Controller, Get, Logger, Req, Res, UseGuards } from '@nestjs/common';
import { FtGuard } from './42/ft.guard';
import { User } from 'src/decorator/user.decorator';
import { UserDto } from 'src/dto/user.dto';

@Controller('/api/auth')
export class AuthController {
  private logger = new Logger(AuthController.name);

  @Get('login')
  @UseGuards(FtGuard)
  login() {}

  @Get('login/callback')
  @UseGuards(FtGuard)
  async loginCallback(@User() user: UserDto) {
    this.logger.log('Login -> callback');
    console.log(user);
    // TODO: DB에 유저 정보가 없으면 추가하도록 구현
    // await this.authService.addUserIfNotExists(user);

    // TODO: 로그인 성공 시, 메인 페이지로 리다이렉트
    // return res.redirect(`${this.configService.get<string>('fe_host')}/main`);
  }
}
