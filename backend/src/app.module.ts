import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { SessionMiddleware } from './middleware/session.middleware';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import TypeOrmConfigService from './config/typeorm.config';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: TypeOrmConfigService,
    }),
    AuthModule,
    UserModule,
    ChatModule,
  ],
  controllers: [AppController],
  providers: [AppService, SessionMiddleware],
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
