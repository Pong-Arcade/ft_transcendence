import * as session from 'express-session';
import { ConfigService } from '@nestjs/config';
import * as passport from 'passport';
import { Injectable } from '@nestjs/common';
import { Middleware } from './middleware';

@Injectable()
export class SessionMiddleware {
  expressSession: Middleware;
  passportInitialize: Middleware;
  passportSession: Middleware;

  constructor(private configService: ConfigService) {
    this.expressSession = session({
      secret: this.configService.get<string>('session.secret'),
      resave: false,
      saveUninitialized: false,
      // TODO: store를 DB로 변경해야 합니다.
      // store: DB store {}
      cookie: {
        maxAge: 86400000, // 24 hours (= 24 * 60 * 60 * 1000 ms)
      },
    });
    this.passportInitialize = passport.initialize();
    this.passportSession = passport.session();
  }
}
