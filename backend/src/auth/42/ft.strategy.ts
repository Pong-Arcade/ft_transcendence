import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-42';
import { UserDto } from 'src/dto/user.dto';

/**
 * passport-42의 전략을 구성합니다.
 * userId, email, intraId을 가져오도록 구성하였습니다.
 * NOTE: 추후 가져올 필드가 필요한 경우 profileFields를 수정하도록 하겠습니다.
 */
@Injectable()
export class FtStrategy extends PassportStrategy(Strategy, '42') {
  constructor(configService: ConfigService) {
    super({
      clientID: configService.get<string>('ftAuth.clientId'),
      clientSecret: configService.get<string>('ftAuth.secret'),
      callbackURL: configService.get<string>('ftAuth.callback'),
      passReqToCallback: true,
      profileFields: {
        userId: 'id',
        email: 'email',
        intraId: 'login',
      },
    });
  }

  /**
   * 42 OAuth 이후 이 정보를 서버 내에서 검증할 때 사용되는 함수이지만
   * 현재 단계에서는 42 로그인에 성공하면 추가적인 검증을 거칠 필요가 없다고 판단하여
   * FtUserDto에 유저정보를 담아 callback으로 넘겨주도록 구성하였습니다.
   */
  async validate(
    request: any,
    accessToken: string,
    refreshToken: string,
    profile: any,
    cb: any,
  ) {
    const user: UserDto = {
      userId: profile.userId,
      nickname: profile.intraId,
      avatarUrl: profile._json.image.link,
      email: profile.email,
    };
    cb(null, user);
  }
}
``;
