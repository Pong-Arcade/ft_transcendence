import { AuthGuard } from '@nestjs/passport';

/**
 * passport-42의 AuthGuard를 상속받아서, 42 OAuth 로그인을 위한 Guard를 정의합니다.
 * 따로 구현하지 않고 기본 기능을 그대로 사용합니다.
 */
export class FtGuard extends AuthGuard('42') {}
