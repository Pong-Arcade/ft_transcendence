import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { UserDto } from 'src/dto/user.dto';
import MockStrategy from './mock.strategy';

/**
 * passport-42의 전략을 구성합니다.
 * userId, email, intraId을 가져오도록 구성하였습니다.
 * NOTE: 추후 가져올 필드가 필요한 경우 profileFields를 수정하도록 하겠습니다.
 */

@Injectable()
export class FtMockStrategy extends PassportStrategy(MockStrategy, '42') {
  async validate(user, cb) {
    cb(null, user);
  }
}
