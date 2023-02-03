import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { FtUserDto } from 'src/dto/ft.user.dto';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  serializeUser(user: FtUserDto, done: any) {
    done(null, user);
  }

  deserializeUser(payload: any, done: any) {
    done(null, payload);
  }
}
