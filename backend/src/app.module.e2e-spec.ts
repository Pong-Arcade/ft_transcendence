import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { SessionMiddleware } from './middleware/session.middleware';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module.e2e-spec';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5434,
      database: 'test',
      username: 'postgres',
      password: 'postgres',
    }),
    AuthModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService, SessionMiddleware],
  exports: [SessionMiddleware],
})
export class AppModule implements NestModule {
  constructor(public sessionMiddleware: SessionMiddleware) {}
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        this.sessionMiddleware.expressSession,
        this.sessionMiddleware.passportInitialize,
        this.sessionMiddleware.passportSession,
      )
      .forRoutes('*');
  }
}
