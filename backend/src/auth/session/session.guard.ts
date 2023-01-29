import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class SessionAuthGuard extends AuthGuard('session') {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const auth = request.isAuthenticated();
    if (!auth) {
      throw new UnauthorizedException('로그인이 필요합니다.');
    }
    return true;
  }
}
