import { Request, Response } from 'express';
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserDto } from 'src/dto/user.dto';

/**
 * userId를 이용해 JWT 토큰을 발급하여 쿠키에 삽입합니다.
 * passport-jwt와는 독립적인 Guard이며, Pong_Arcade의 인증 수단으로 사용됩니다.
 */
@Injectable()
export class JWTSignGuard implements CanActivate {
  private logger = new Logger(JWTSignGuard.name);

  constructor(
    private jwtService: JwtService,
    @Inject(ConfigService) private configService: ConfigService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();
    return this.generateJWTToken(req, res);
  }

  private generateJWTToken(request: Request, response: Response): boolean {
    const user = request.user as UserDto | undefined;
    if (user === undefined) {
      this.logger.debug(`유저 정보가 없어 토큰 발행에 실패합니다.`);
      return false;
    }
    const token = this.jwtService.sign({
      userId: user.userId,
      nickname: user.nickname,
    });
    const expires = new Date(this.jwtService.decode(token)['exp'] * 1000);
    const domain = this.configService
      .get<string>('fe_host')
      .replace('http://', '');
    this.logger.debug(`${user.nickname}의 토큰을 생성합니다.`);
    response.cookie(this.configService.get<string>('jwt.token'), token, {
      expires,
      domain,
    });
    return true;
  }
}
