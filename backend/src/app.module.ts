import { CacheModule, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { GameModule } from './game/game.module';
import TypeOrmConfigService from './config/typeorm.config';
import { ChatModule } from './chat/chat.module';
import { RelationModule } from './relation/relation.module';
import { StatModule } from './stat/stat.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { UtilsModule } from './utils/utils.module';
import { AdminUIModule } from './socketAdminUI/adminUI.module';

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
    CacheModule.register({
      isGlobal: true,
    }),
    EventEmitterModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    AuthModule,
    UserModule,
    ChatModule,
    GameModule,
    RelationModule,
    StatModule,
    UtilsModule,
    AdminUIModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
