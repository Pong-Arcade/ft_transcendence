import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
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

  afterEach(async () => {
    await app.close();
  });

  describe('온라인 유저 조회', () => {
    describe('/api/users/online-users/ (GET)', () => {
      it('비정상적인 요청 - 로그인하지 않은 유저의 요청', async () => {
        // given

        // when
        const response = await request(app.getHttpServer()).get(
          '/api/users/online-users/?page=1&length=10',
        );

        // then
        expect(response.status).toBe(401);
      });
    });

    it('정상적인 요청', async () => {
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
});
