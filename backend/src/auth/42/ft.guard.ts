import { ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * passport-42의 기본 인증을 사용합니다.
 * NOTE: 추후 커스텀이 필요한 경우 handleRequest()를 오버라이드하여 구현하도록 하겠습니다.
 */
export class FtGuard extends AuthGuard('42') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const result = (await super.canActivate(context)) as boolean;
    const request = context.switchToHttp().getRequest();
    await super.logIn(request);
    return result;
  }
}
