import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module.e2e-spec';

describe('ChatController (e2e)', () => {
  let app: INestApplication;
  let cookie: string[];
  let chats: string[];

  beforeAll(describe('Login', async () => {
	//	테스트 시작 전 모듈 초기화/로그인
	const module: TestingModule = await Test.createTestingModule({
		imports: [AppModule],
	}).compile();	//	루트 모듈로 테스트 모듈 생성

	app = module.createNestApplication();
	await app.init();	//	초기화
	const response = await request(app.getHttpServer()).get('/api/auth/login');
	cookie = response.header['set-cookie'];	//	로그인해서 쿠키 세팅
  	});
  );

  beforeEach(async () => {	//	테스트 전 해야하는 루틴
	  chat = [];
  });

  afterEach(async () => {
  });

  describe('채팅방 목록 조회', () => {
    describe('/api/chat-rooms/?page={}&length={} (GET)', () => {
      it('비정상적인 요청', async () => {
        // given

        // when
        const response = await request(app.getHttpServer()).get(
          '/api/chat-rooms/?page=1&length=5,
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

  /**
   *	roomId로 해당 채팅방의 유저 목록을 확인합니다.
   * 채팅방은 master 유저가 소유하며, master 유저가 나가면 방이 폭파
   * master 유저는 다른 유저를 admin으로 등록할 수 있습니다.
   */
});
