import { Controller, Get, Logger, Req, UseGuards } from '@nestjs/common';
import { FtGuard } from './42/ft.guard';
import { User } from 'src/decorator/user.decorator';
import { UserDto } from 'src/dto/user.dto';
import { SessionAuthGuard } from './session/session.guard';
import { Request } from 'express';

@Controller('/api/auth')
export class AuthController {
  private logger = new Logger(AuthController.name);

  @Get('login')
  @UseGuards(FtGuard)
  login() {
    this.logger.log('Cannot be reached');
  }

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

  @Get('test')
  @UseGuards(SessionAuthGuard)
  test(@User() user: UserDto) {
    console.log(user);
  }

  @Get('logout')
  // TODO: 200 OK를 보내도록 하고, 클라이언트는 이를 받으면 쿠키를 삭제하고 로그인 페이지로 리다이렉트하도록 구현
  logout(@Req() req: Request) {
    req.session.destroy((err) => {
      if (err) {
        this.logger.error(err);
      }
    });
  }
}
