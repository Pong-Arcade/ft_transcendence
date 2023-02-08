import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { UserDto } from 'src/dto/user.dto';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  serializeUser(user: UserDto, done: any) {
    done(null, user);
  }

  deserializeUser(payload: any, done: any) {
    done(null, payload);
  }
}
