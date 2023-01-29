import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../src/user/user.controller';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { UserModule } from '../src/user/user.module';
import { AppModule } from '../src/app.module.e2e-spec';

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let cookie: string[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = module.createNestApplication();
    await app.init();
    const response = await request(app.getHttpServer()).get('/api/auth/login');
    cookie = response.header['set-cookie'];
  });

  it('/api/users/online-users/ (GET)', async () => {
    // given
    const userCookie = cookie;

    // when
    const response = await request(app.getHttpServer())
      .get('/api/users/online-users/?page=1&length=10')
      .set('Cookie', userCookie);

    // then
    expect(response.status).toBe(200);
  });
});
