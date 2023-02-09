import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * JwtStrategy를 사용하는 Guard입니다.
 * 토큰 정보가 유효하지 않은 유저가 요청을 보내면 401 에러를 반환합니다.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest<TUser = any>(err: any, user: any): TUser {
    if (err || !user) {
      throw (
        err ||
        new UnauthorizedException(
          '로그인 정보가 유효하지 않습니다. 다시 로그인해주세요.',
        )
      );
    }
    return user;
  }
}
