import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';

/**
 * passport-jwt Strategy
 * 생성자에서 JWT 토큰을 추출할 함수와 시크릿 키를 설정합니다.
 * Request Header에 담겨있는 토큰을 추출하는 함수를 사용합니다.
 * NOTE: WebSocket에서는 Request Header가 아닌 handshake.auth에 토큰이 담겨있습니다.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('jwt.secret'),
    });
  }

  /**
   * validate 함수는 토큰을 검증하는 함수입니다.
   * 유저가 DB에 존재하지 않는다면 인증을 거부합니다.
   */
  async validate(payload: any) {
    const exist = await this.authService.getUserAuthInfoById(payload.userId);
    if (!exist) {
      return false;
    }
    return payload;
  }
}
